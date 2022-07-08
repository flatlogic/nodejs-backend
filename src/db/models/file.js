module.exports = function (sequelize, DataTypes) {
  const file = sequelize.define(
    'file',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      belongsTo: DataTypes.STRING(255),
      belongsToId: DataTypes.UUID,
      belongsToColumn: DataTypes.STRING(255),
      name: {
        type: DataTypes.STRING(2083),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      sizeInBytes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      privateUrl: {
        type: DataTypes.STRING(2083),
        allowNull: true,
      },
      publicUrl: {
        type: DataTypes.STRING(2083),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  file.associate = db => {
    db.file.belongsTo(db.user, {
      as: 'createdBy',
    });

    db.file.belongsTo(db.user, {
      as: 'updatedBy',
    });
  };

  return file;
};
