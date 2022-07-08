import { ValidationError } from './notifications/errors/validation.js';
import * as UserDBApi from '../db/api/user.js';
import * as AuthService from './auth.js';
import db from '../db/models/index.js';

export async function create(data, currentUser, sendInvitationEmails = true, host) {
  let transaction = await db.sequelize.transaction();
  let email = data.email;
  let emailsToInvite = [];

  try {
    if (email) {
      let user = await UserDBApi.findBy({ email }, { transaction });

      if (user) {
        throw new ValidationError('iam.errors.userAlreadyExists');
      } else {
        await UserDBApi.create(
          { data },
          {
            currentUser,
            transaction,
          },
        );

        emailsToInvite.push(email);
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  if (emailsToInvite && emailsToInvite.length) {
    if (!sendInvitationEmails) {
      return;
    }

    AuthService.sendPasswordResetEmail(email, 'invitation', host);
  }
}

export async function update(data, id, currentUser) {
  const transaction = await db.sequelize.transaction();
  try {
    let user = await UserDBApi.findBy({ id }, { transaction });

    if (!user) {
      throw new ValidationError('iam.errors.userNotFound');
    }

    await UserDBApi.update(id, data, {
      currentUser,
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export async function remove(id, currentUser) {
  const transaction = await db.sequelize.transaction();

  try {
    if (currentUser.id === id) {
      throw new ValidationError('iam.errors.deletingHimself');
    }

    if (currentUser.role !== 'admin') {
      throw new ValidationError('errors.forbidden.message');
    }

    await UserDBApi.remove(id, {
      currentUser,
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
