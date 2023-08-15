const { Op} = require("sequelize");
const { Products, Users } = require("../models");
const jwt = require("jsonwebtoken");

const getAllProducts = async (req, res, next) => {
  try {
    // pedir todos los productos al modelo Products
    const products = await Products.findAll({
      where: {
        availableQty: {
          [Op.gt]: 0,
        },
      },
      include : {
        model: Users,
        attributes :  ['firstname', 'lastname']
      }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  
  try {
    const { file } = req;
    const { name, description, price, availableQty   } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: "HS512",
    });

    const url = process.env.NODE_ENV === 'production' ? `${process.env.URL}/public/images/${file.filename}` :
      `${process.env.URL}:${process.env.PORT}/public/images/${file.filename}`;

    // const data = body.map( i => ({...i , url }))
  
    const product = await Products.create({
      name, 
      description,
      price,
      availableQty,
      userId: decoded.id,
      productImage:url
    })

    res.status(201).json(product)
  } catch (error) {
    next(error)
  }

} 

const updateProduct = async (req, res, next) => {
  
  try {
    const {id} = req.params;

    const result = await Products.update(req.body, {
      where : {id}
    })
    result[0] === "0" || result[0] === 0  ? 
      res.json({msg : "Product no exist, verified id!"}) : 
      res.json({msg: "Update correct!"})
  } catch (error) {
    next(error)
  }
}

const updateImageProduct = async (req,res,next) =>{
  try {
    
    const { file, body } = req;
    const url = process.env.NODE_ENV === 'production' ? `${process.env.URL}/public/images/${file.filename}` :
      `${process.env.URL}:${process.env.PORT}/public/images/${file.filename}`
    const result = await Products.update({productImage: url}, {
      where : {id: Number(body.id)}
    })
    result[0] === "0" || result[0] === 0  ? 
    res.json({msg : "Product no exist, verified id!"}) : 
    res.json({msg: "Update Image correct!"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  updateImageProduct
};
