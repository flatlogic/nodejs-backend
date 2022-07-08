const validator = require('validator');
const Sequelize = require('./models').Sequelize;

module.exports = class Utils {
  static uuid(value) {
    let id = value;

    if (!validator.isUUID(id)) {
      id = uuid();
    }

    return id;
  }

  static ilike(model, column, value) {
    return Sequelize.where(Sequelize.fn('lower', Sequelize.col(`${model}.${column}`)), {
      [Sequelize.Op.like]: `%${value}%`.toLowerCase(),
    });
  }
};
