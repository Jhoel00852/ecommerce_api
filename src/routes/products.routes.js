const { Router } = require('express');
const {getAllProducts, createProduct, updateProduct, updateImageProduct} = require('../controllers/products.controller');
const authenticate = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


const router = Router();

router.route("/products")
.get(getAllProducts)
.post(authenticate, upload.single("productImage"), createProduct)
.put(authenticate, upload.single("productImage"), updateImageProduct )

//actualizar datos, menos image y userid
router.put("/products-update/:id", authenticate, updateProduct )

module.exports = router;