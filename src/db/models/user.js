const config = require('../../config/config.js');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      no_disable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      firstName: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        allowNull: true,
        defaultValue: 'user',
      },
      provider: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: providers.LOCAL,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      emailVerificationTokenExpiresAt: {
        type: DataTypes.DATE,
      },
      passwordResetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      passwordResetTokenExpiresAt: { type: DataTypes.DATE },
      lastName: {
        type: DataTypes.STRING(175),
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(24),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      authenticationUid: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  user.associate = db => {
    db.user.hasMany(db.file, {
      as: { singular: 'avatar', plural: 'avatars' },
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.user.getTableName(),
        belongsToColumn: 'avatars',
      },
    });

    db.user.belongsTo(db.user, {
      as: 'createdBy',
    });

    db.user.belongsTo(db.user, {
      as: 'updatedBy',
    });
  };

  user.beforeCreate((user, options) => {
    user = trimStringFields(user);

    if (user.provider !== providers.LOCAL && Object.values(providers).indexOf(user.provider) > -1) {
      user.emailVerified = true;

      if (!user.password) {
        const password = crypto.randomBytes(20).toString('hex');

        const hashedPassword = bcrypt.hashSync(password, config.bcrypt.saltRounds);

        user.password = hashedPassword;
      }
    }
  });

  user.beforeUpdate((user, options) => {
    user = trimStringFields(user);
  });

  return user;
};

function trimStringFields(user) {
  user.email = user.email.trim();

  user.firstName = user.firstName ? user.firstName.trim() : null;

  user.lastName = user.lastName ? user.lastName.trim() : null;

  return user;
}
