
const { Cars, ProductsInCars, Orders, ProductsInOrders, Users } = require("../models");
const jwt = require("jsonwebtoken");
const { sendOrderEmail } = require("../utils/sendMail");

const addProductToCar = async (req, res, next) => {
  try {
    // por el body debe venir la sig info
    // { productId, quantity, price }
    const carId = req.params.id;
    const { productId, quantity, price } = req.body;

    // quiero que si el producto ya existe en el carrito entonces sume la cantidad y no cree uno nuevo
    // verificar si el carrido con el id  ya tiene un producto con el productoId
    // entonces sumamos - si no existe lo creamos

    const productInCar = await ProductsInCars.findAll({
      where: {
        carId, 
        productId 
      },
    }); // si el carId y productId
    // console.log(productInCar);
    if (productInCar.length < 1) {
      await ProductsInCars.create({ carId, productId, quantity, price });
    }

    if (productInCar.length > 0) {
      await ProductsInCars.increment({ quantity }, { where: { carId } });
    }

    // si agrego un producto
    // debo actualizar el total del carrito
    // multiplico el price * quantity
    await Cars.increment({ total: quantity * price }, { where: { id: carId } });

    res.json({msg: "Product add in car"});
  } catch (error) {
    next(error);
  }
};

const getProductsInCar = async (req, res, next) => {
  try {

    const {id} = req.params

    const productsInCar = await ProductsInCars.findAll({
      where: {
        carId: id,
        purchased: false
      }
    })

    res.json(productsInCar)
  } catch (error) {
    next(error)
  }
}

const buyProductsInCar = async (req, res, next) => {
  try {
    // que necesitamos para crear una orden?
    // userId
    // creo la orden con el userId -- para obtner el id
    // agregar los productos del carrito a la orden
    // orderID
    // arreglo con cada producto en el carrito
    // [{productId, price, quantity},{}]
    // agregar el total a la orden

    // /prodcuts?name=hola&&pricemin=50&&pricemax=100
    // { userId, products= [{productId, price, quantity, orderId: order.id},{productId, price, quantity}] }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: "HS512",
    });
    const { products } = req.body;
    // console.log(req.body);
    let total = 0;
    products.forEach((product) => {
      total += product.price * product.quantity;
    });

    const order = await Orders.create({ userId: decoded.id, total });

    const productsWithOrder = products.map((product) => ({
      ...product,
      orderId: order.id,
    }));
   
    await ProductsInOrders.bulkCreate(productsWithOrder);
    
    res.status(201).json({
      orderId: order.id,
      total: order.total,
      products: productsWithOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsInOrder = async(req,res,next) => {
  try {
    const {id} = req.params;
    const order = await Orders.findOne({
      where : {id}
    })
    const productsInOrder = await ProductsInOrders.findAll({
      where : {
        orderId : id
      }
    })
    res.json({order,productsInOrder})
  } catch (error) {
    next(error)
  }
}

const getOrdersUser = async(req, res, next) => {
  try {
    const {user} = req.query;
    const ordersUser = await Orders.findAll({
      where : {userId: Number(user)}
    })
    res.json(ordersUser)

  } catch (error) {
    next(error)
  }
} 

const completeBuy = async (req, res, next) => {
  try {
    const {id} = req.body
    const result = await Orders.update({completed: true}, {where :{id}})

    if(result[0] === "0" || result[0] === 0) { 
    return res.json({msg: "Order no exist, verified id!"})
    }else{
      const products = await ProductsInOrders.findAll({
        where: {orderId: id}
      })
  
      await products.map( i => {
          ProductsInCars.update({purchased : true}, {
            where: {productId: i.productId}
          })
        });
    
      
      const order = await Orders.findOne({where: {id}})

      const user = await Users.findOne({where: {id: order.userId}})

      let data = {};
      data.fullname = `${user.firstname} ${user.lastname}`
      data.email = user.email
      data.orderId = order.id
      data.total = order.total
      data.productDetail = products
      sendOrderEmail(user.email, `Thanks for your order #${order.id}`,data)
      res.json({msg : "Purchased correct!"})
    }



  } catch (error) {
    next(error)
  }
} 

module.exports = {
  addProductToCar,
  buyProductsInCar,
  getProductsInCar,
  getProductsInOrder,
  completeBuy,
  getOrdersUser
};
