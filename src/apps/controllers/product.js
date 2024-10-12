
const ProductModel      = require('../models/product');
const CategoryModel     = require('../models/category');
const Paging            = require('../../common/paginate');
const {formatCurrency}  = require('../../libs/library');
const slug              = require('slug');
const path              = require('path');
const fs                = require('fs');
const Module            = 'product';


const ProductsControllers = {
    products : async(req, res) => {
        const current_page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = current_page * limit - limit;
        const products = await ProductModel.find()
                        .populate("cat_id")
                        .skip(skip)
                        .limit(limit)
                        .sort({ _id: -1}) // Sort ( -1: mới thêm; 1: cũ nhất)
        
        const total     = await ProductModel.find().countDocuments();
        const total_page = Math.ceil(total / limit);    
        const paging     = Paging(total_page, current_page, req.route.path);
        
        res.render('../views/admin/products/product', {
            products, 
            paging,
            Module,
            formatCurrency 
        });

    },

    create : async (req, res) => {
        const categories = await CategoryModel.find();

        res.render('../views/admin/products/add_product', {
            categories,
            formatCurrency, 
            Module
        });
    }, 

    store : async (req, res) => {
        const {body, file} = req;

        const product = {
            description   : body.description,
            price         : body.price.replaceAll(',','').replaceAll('.',''),
            cat_id        : body.cat_id,
            status        : body.status,
            featured      : body.featured == 1 || false,
            promotion     : body.promotion,
            warranty      : body.warranty,
            accessories   : body.accessories,
            is_stock      : body.is_stock,
            name          : body.name,
            slug          : slug(body.name)
        }

        if(file) {
            const thumbnail = `products/${file.originalname}`
            fs.renameSync( file.path, path.resolve("src/public/uploads/images/" , thumbnail) ); // fs.renameSync('đường dẫn hiện tại ảnh', 'đường dẫn tuyệt đối')
            product.thumbnail = thumbnail;

            await new ProductModel(product).save();
            res.redirect('/admin/products')
        }
        
    }, 

    edit : async (req, res) => {

        const {id} = req.params
        const product = await ProductModel.findById({ _id: id})
        const categories = await CategoryModel.find();

        const page = {
            product_detail : product,
            category : categories
        }

        res.render('../views/admin/products/edit_product', {
            page,
            formatCurrency,
            Module
        });
    }, 

    update : async (req, res) => {
        const {body, file} = req;
        const {id} = req.params;
        
        const product = {
            description   : body.description,
            price         : body.price.replaceAll('.','').replaceAll(',',''),
            cat_id        : body.cat_id,
            status        : body.status,
            featured      : body.featured == "on" || false,
            promotion     : body.promotion,
            warranty      : body.warranty,
            accessories   : body.accessories,
            is_stock      : body.is_stock,
            name          : body.name,
            slug          : slug(body.name)
        }
        
        if(file) {
            const thumbnail = `products/${file.originalname}`
            fs.renameSync( file.path, path.resolve("src/public/uploads/images/" , thumbnail) ); // fs.renameSync('đường dẫn hiện tại ảnh', 'đường dẫn tuyệt đối')
            product.thumbnail = thumbnail;
        }

        await ProductModel.updateOne(
            { _id: id },
            product
        );
        res.redirect('/admin/products')
    }, 

    delete : async (req, res) => {
        const {id} = req.params;
        await ProductModel.deleteOne( {_id: id} )
        res.redirect('/admin/products')
    }
}

module.exports = ProductsControllers;
