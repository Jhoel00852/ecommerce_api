"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Orders.belongsTo(models.ProductsInOrders, 
      //   { foreignKey: "orderId" });
      Orders.belongsTo(models.Users, { foreignKey: "userId" });
      Orders.belongsToMany(models.Products, { 
        through: "ProductsInOrders", 
        foreignKey : "orderId" 
      });
    }
  }
  Orders.init(
    {
      userId: DataTypes.INTEGER,
      total: DataTypes.REAL,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Orders",
    }
  );
  return Orders;
};
