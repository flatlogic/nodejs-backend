import * as UserDBApi from '../db/api/user.js';
import { ValidationError } from './notifications/errors/validation.js';
import { ForbiddenError } from './notifications/errors/forbidden.js';
import bcrypt from 'bcrypt';
import { EmailAddressVerificationEmail } from './email/list/addressVerification.js';
import { PasswordResetEmail } from './email/list/passwordReset.js';
import { InvitationEmail } from './email/list/invitation.js';
import { EmailSender } from './email/index.js';
import config from '../config/config.js';
import { jwtSign } from '../helpers.js';
import db from '../db/models/index.js';

export async function signup(email, password, options = {}, host) {
  const user = await UserDBApi.findBy({ email });

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  if (user) {
    if (user.authenticationUid) {
      throw new ValidationError('auth.emailAlreadyInUse');
    }

    if (user.disabled) {
      throw new ValidationError('auth.userDisabled');
    }

    await UserDBApi.updatePassword(user.id, hashedPassword, options);

    if (EmailSender.isConfigured) {
      await this.sendEmailAddressVerificationEmail(user.email, host);
    }

    const data = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    return jwtSign(data);
  }

  const newUser = await UserDBApi.createFromAuth(
    {
      firstName: email.split('@')[0],
      password: hashedPassword,
      email: email,
    },
    options,
  );

  if (EmailSender.isConfigured) {
    await this.sendEmailAddressVerificationEmail(newUser.email, host);
  }

  const data = {
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  };

  return jwtSign(data);
}

export async function signin(email, password, options = {}) {
  const user = await UserDBApi.findBy({ email });

  if (!user) {
    throw new ValidationError('auth.userNotFound');
  }

  if (user.disabled) {
    throw new ValidationError('auth.userDisabled');
  }

  if (!user.password) {
    throw new ValidationError('auth.wrongPassword');
  }

  if (!EmailSender.isConfigured) {
    user.emailVerified = true;
  }

  if (!user.emailVerified) {
    throw new ValidationError('auth.userNotVerified');
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    throw new ValidationError('auth.wrongPassword');
  }

  const data = {
    user: {
      id: user.id,
      email: user.email,
    },
  };

  return jwtSign(data);
}

export async function sendEmailAddressVerificationEmail(email, host) {
  if (!EmailSender.isConfigured) {
    throw new Error(
      `Email provider is not configured. Please configure it at backend/config/<environment>.json.`,
    );
  }

  let link;
  try {
    const token = await UserDBApi.generateEmailVerificationToken(email);
    link = `${host}#/verify-email?token=${token}`;
  } catch (error) {
    console.error(error);
    throw new ValidationError('auth.emailAddressVerificationEmail.error');
  }

  const emailAddressVerificationEmail = new EmailAddressVerificationEmail(email, link);

  return new EmailSender(emailAddressVerificationEmail).send();
}

export async function sendPasswordResetEmail(email, type = 'register', host) {
  if (!EmailSender.isConfigured) {
    throw new Error(
      `Email provider is not configured. Please configure it at backend/config/<environment>.json.`,
    );
  }

  let link;

  try {
    const token = await UserDBApi.generatePasswordResetToken(email);
    link = `${host}#/password-reset?token=${token}`;
  } catch (error) {
    console.error(error);
    throw new ValidationError('auth.passwordReset.error');
  }

  let passwordResetEmail;
  if (type === 'register') {
    passwordResetEmail = new PasswordResetEmail(email, link);
  }
  if (type === 'invitation') {
    passwordResetEmail = new InvitationEmail(email, link);
  }

  return new EmailSender(passwordResetEmail).send();
}

export async function verifyEmail(token, options = {}) {
  const user = await UserDBApi.findByEmailVerificationToken(token, options);

  if (!user) {
    throw new ValidationError('auth.emailAddressVerificationEmail.invalidToken');
  }

  return UserDBApi.markEmailVerified(user.id, options);
}

export async function passwordUpdate(currentPassword, newPassword, options) {
  const currentUser = options.currentUser || null;
  if (!currentUser) {
    throw new ForbiddenError();
  }

  const currentPasswordMatch = await bcrypt.compare(currentPassword, currentUser.password);

  if (!currentPasswordMatch) {
    throw new ValidationError('auth.wrongPassword');
  }

  const newPasswordMatch = await bcrypt.compare(newPassword, currentUser.password);

  if (newPasswordMatch) {
    throw new ValidationError('auth.passwordUpdate.samePassword');
  }

  const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

  return UserDBApi.updatePassword(currentUser.id, hashedPassword, options);
}

export async function passwordReset(token, password, options = {}) {
  const user = await UserDBApi.findByPasswordResetToken(token, options);

  if (!user) {
    throw new ValidationError('auth.passwordReset.invalidToken');
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  return UserDBApi.updatePassword(user.id, hashedPassword, options);
}

export async function updateProfile(data, currentUser) {
  let transaction = await db.sequelize.transaction();

  try {
    await UserDBApi.findBy({ id: currentUser.id }, { transaction });

    await UserDBApi.update(currentUser.id, data, {
      currentUser,
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
