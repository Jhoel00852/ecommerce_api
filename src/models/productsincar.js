'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductsInCars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // ProductsInCar.belongsTo(models.Cars, {foreignKey: "carId"})
      // ProductsInCar.belongsTo(models.Products, { foreignKey: "productId"})
    }
  }
  ProductsInCars.init({
    carId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.REAL,
    purchased: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ProductsInCars',
  });
  return ProductsInCars;
};