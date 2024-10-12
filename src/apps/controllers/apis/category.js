const CategoryModel     = require('../../models/category');
const ProductModel      = require('../../models/product');
const pagingation       = require('../../../libs/pagingation')


module.exports = {

    index: async (req,res) =>{
        
        try {
            const categories = await CategoryModel.find();

            return res.status(200).json({
                status : "success",
                data : {
                    all_category : categories,
                }
            });

        } catch (error) {
            
            return res.status(500).json(error);

        }

    },

    show: async(req,res) =>{

        try {
            
            const {id} = req.params;
            const category = await CategoryModel.findById( { _id : id } )

            return res.status(200).json({
                status : "success",
                data : category
            });

        } catch (error) {
            
            return res.status(500).json(error);

        }

    },

    categoryProducts: async(req,res) =>{

        try {
            
            const {id}          = req.params;
            const category      = await CategoryModel.findById( { _id : id } )
            const query         = {};
            query.cat_id        = id;
            const limit         = Number(req.query.limit) || 10
            const current_page  = parseInt(req.query.page) || 1;
            const skip          = current_page * limit - limit;

            const products      = await ProductModel.find(query)
                                    .populate("cat_id")
                                    .sort({ _id : -1 })
                                    .skip(skip)
                                    .limit(limit);
            
            return res.status(200).json({
                status : "success",
                current_category : category,
                paging : await pagingation(current_page, limit, ProductModel, query),
                product_list: products
            });

        } catch (error) {
            
            return res.status(500).json(error);

        }

    }

}