const express = require("express")
const router = express.Router()

const AuthMiddleWare = require('../apps/middlewares/auth_customer');


// import controler
const CategoriesController = require('../apps/controllers/apis/category')
router.get("/categories", AuthMiddleWare.verifyAuthentication ,CategoriesController.index);
router.get("/categories/:id", CategoriesController.show);
router.get("/categories/:id/products", CategoriesController.categoryProducts);

// Product
const ProductsController = require('../apps/controllers/apis/product')
router.get("/products", ProductsController.index);
router.get("/products/:id", ProductsController.show);
router.get("/products/:id/comments", ProductsController.commentsProduct);
router.post( "/products/:id/comment", ProductsController.storeCommentProduct);


// Order
const OrderController = require('../apps/controllers/apis/order')
router.get("/order", OrderController.order);
router.get("/customer/:id/index", OrderController.index);
router.get("/customer/order/:id", OrderController.orderDetail);
router.get("/customer/cancel/:id", OrderController.orderCancel);


//Slider
const SlidersController = require('../apps/controllers/apis/slider')
router.get('/sliders', SlidersController.index)

//Banner
const BannerController = require("../apps/controllers/apis/banner")
router.get('/banners', BannerController.index)


// Customer (login/registor)
const CustomerController = require('../apps/controllers/apis/auth')
router.post('/customer/registor', CustomerController.registerCustomer)
router.post('/customer/login', CustomerController.customerLogin)
router.get('/customer/logout/:id', CustomerController.customerLogout)
router.get('/customer/refreshToken', CustomerController.requestRefreshToken)


module.exports = router