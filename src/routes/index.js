const userRoutes = require("./user.routes");
const productsRoutes = require("./products.routes");
const carsRoutes = require("./cars.routes")
const apiRoutes = (app) => {
  app.use(userRoutes);
  app.use(productsRoutes);
  app.use(carsRoutes)

};

module.exports = apiRoutes;
