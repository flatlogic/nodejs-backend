export const errors = {
  app: {
    title: 'Application',
  },

  auth: {
    userDisabled: 'Your account is disabled',
    userNotFound: `Sorry, we don't recognize your credentials`,
    wrongPassword: `Sorry, we don't recognize your credentials`,
    weakPassword: 'This password is too weak',
    emailAlreadyInUse: 'Email is already in use',
    invalidEmail: 'Please provide a valid email',
    passwordReset: {
      invalidToken: 'Password reset link is invalid or has expired',
      error: `Email not recognized`,
    },
    passwordUpdate: {
      samePassword: `You can't use the same password. Please create new password`,
    },
    userNotVerified: `Sorry, your email has not been verified yet`,
    emailAddressVerificationEmail: {
      invalidToken: 'Email verification link is invalid or has expired',
      error: `Email not recognized`,
    },
  },

  iam: {
    errors: {
      userAlreadyExists: 'User with this email already exists',
      userNotFound: 'User not found',
      disablingHimself: `You can't disable yourself`,
      revokingOwnPermission: `You can't revoke your own owner permission`,
      deletingHimself: `You can't delete yourself`,
    },
  },

  importer: {
    errors: {
      invalidFileEmpty: 'The file is empty',
      invalidFileExcel: 'Only excel (.xlsx) files are allowed',
      invalidFileUpload: 'Invalid file. Make sure you are using the last version of the template.',
      importHashRequired: 'Import hash is required',
      importHashExistent: 'Data has already been imported',
    },
  },

  errors: {
    forbidden: {
      message: 'Forbidden',
    },
    validation: {
      message: 'An error occurred',
    },
  },

  emails: {
    invitation: {
      subject: `You've been invited to {0}`,
      body: `    
        <p>Hello,</p>
        <p>You've been invited to {0} set password for your {1} account.</p>
        <p><a href='{2}'>{2}</a></p>
        <p>Thanks,</p>
        <p>Your {0} team</p>
      `,
    },
    emailAddressVerification: {
      subject: `Verify your email for {0}`,
      body: `
        <p>Hello,</p>
        <p>Follow this link to verify your email address.</p>
        <p><a href='{0}'>{0}</a></p>
        <p>If you didn’t ask to verify this address, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your {1} team</p>
      `,
    },
    passwordReset: {
      subject: `Reset your password for {0}`,
      body: `
        <p>Hello,</p>
        <p>Follow this link to reset your {0} password for your {1} account.</p>
        <p><a href='{2}'>{2}</a></p>
        <p>If you didn’t ask to reset your password, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your {0} team</p>
      `,
    },
  },
};
