const { Router } = require('express');
const {
    addProductToCar,
    buyProductsInCar,
    getProductsInCar,
    getProductsInOrder,
    completeBuy,
    getOrdersUser
} = require('../controllers/cars.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = Router();

//definir el nombre de variables, metodos, funciones, etc, etc
//lo mas descriptivo posible - no importa el tamaño del nombre
router.post("/products/car/:id", authenticate, addProductToCar);
router.get("/cars/:id", authenticate, getProductsInCar)
router.get("/orders/:id", authenticate, getProductsInOrder)
router.post("/products/order", authenticate, buyProductsInCar);
router.get("/orders", authenticate, getOrdersUser)

router.post("/buy", authenticate, completeBuy)

module.exports = router;