'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      img: DataTypes.STRING,
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      rating: DataTypes.DECIMAL,
      description_1: DataTypes.STRING,
      description_2: DataTypes.STRING,
      code: DataTypes.DECIMAL,
      hashtag: DataTypes.STRING,
      technology: DataTypes.ARRAY(DataTypes.STRING),
      discount: DataTypes.DECIMAL,
    },
    {},
  );
  Product.associate = function (models) {
    // associations can be defined here
  };
  return Product;
};
