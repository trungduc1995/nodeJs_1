const ProductModel      = require('../models/product');
const UserModel         = require('../models//user');
const CommentModel      = require('../models/comment');
const {formatCurrency}  = require ('../../libs/library');
const Module            = 'home';

const Admin = {
    index : async (req, res) => {
        const products_count = await ProductModel.find().countDocuments();        
        const users_count = await UserModel.find().countDocuments();
        const comment_count = await CommentModel.find().countDocuments();
    
        res.render('../views/admin/dashboard', {
            products_count, 
            users_count, 
            comment_count, 
            Module,
            formatCurrency
        });

    }
}

module.exports = Admin;
