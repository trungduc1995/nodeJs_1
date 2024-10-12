const express = require("express");
const rounter = express.Router();

// Import Middlewares
const UploadMiddleware  = require('../apps/middlewares/upload');
const AuthMiddleware    = require('../apps/middlewares/auth');

// Import Controllers
const TestController = require("../apps/controllers/test");
rounter.get( "/test1", TestController.test1);
rounter.get( "/test2", TestController.test2);


// Import Controllers
const AdminController = require("../apps/controllers/admin")
rounter.get( "/admin/dashboard", AuthMiddleware.checkAdmin, AdminController.index);


const AuthController = require("../apps/controllers/auth");
rounter.get( "/admin/login",  AuthMiddleware.checkLogin,  AuthController.login);
rounter.post( "/admin/login", AuthMiddleware.checkLogin, AuthController.postLogin);
rounter.get( "/admin/logout", AuthController.logout);


const UsersController = require("../apps/controllers/users")
rounter.get( "/admin/users",            AuthMiddleware.checkAdmin, UsersController.user);
rounter.get( "/admin/users/create" ,    AuthMiddleware.checkAdmin, UsersController.create)
rounter.post( "/admin/users/store",     AuthMiddleware.checkAdmin, UsersController.store);
rounter.post( "/admin/users/update/:id", AuthMiddleware.checkAdmin, UsersController.update);
rounter.get( "/admin/users/edit/:id" ,  AuthMiddleware.checkAdmin, UsersController.edit)
rounter.get( "/admin/users/delete/:id", AuthMiddleware.checkAdmin, UsersController.delete)


const ProductsControllers = require("../apps/controllers/product")
rounter.get( "/admin/products",             AuthMiddleware.checkAdmin, ProductsControllers.products);
rounter.get( "/admin/products/create",      AuthMiddleware.checkAdmin, ProductsControllers.create);
rounter.post( "/admin/products/update/:id", AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), ProductsControllers.update);
rounter.post( "/admin/products/store",      AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), ProductsControllers.store);
rounter.get( "/admin/products/edit/:id",    AuthMiddleware.checkAdmin, ProductsControllers.edit);
rounter.get( "/admin/products/delete/:id",  AuthMiddleware.checkAdmin, ProductsControllers.delete);


const CategoriesControllers = require("../apps/controllers/categories")
rounter.get('/admin/categories',            AuthMiddleware.checkAdmin, CategoriesControllers.categories)
rounter.get('/admin/categories/create',     AuthMiddleware.checkAdmin, CategoriesControllers.create)
rounter.post( "/admin/categories/update/:id", AuthMiddleware.checkAdmin, CategoriesControllers.update);
rounter.post( "/admin/categories/store",    AuthMiddleware.checkAdmin, CategoriesControllers.store);
rounter.get('/admin/categories/edit/:id',   AuthMiddleware.checkAdmin, CategoriesControllers.edit)
rounter.get('/admin/categories/delete/:id', AuthMiddleware.checkAdmin, CategoriesControllers.delete)





module.exports = rounter;