const ProductModel  = require('../../models/product');
const CommentModel  = require('../../models/comment')
const pagingation   = require('../../../libs/pagingation');

module.exports = {

    index: async (req,res) =>{
        
        try {
            const query = {};

            if(req.query.featured) query.featured = req.query.featured
            if(req.query.name) query.$text = {$search: req.query.name}

            const limit     = Number(req.query.limit) || 10
            const current_page = parseInt(req.query.page) || 1;
            const skip      = current_page * limit - limit;
            const products  = await ProductModel.find(query)
                                    .populate("cat_id")
                                    .sort({ _id : -1 })
                                    .skip(skip)
                                    .limit(limit);

            return res.status(200).json({
                status          : "success",
                filters : {
                    featured : req.query.featured || null,
                    limit,
                    current_page
                },
                paging : await pagingation(current_page, limit, ProductModel, query),
                product_list : products
            });

        } catch (error) {
            
            return res.status(500).json(error);

        }

    }, 

    show: async (req,res) =>{
        
        try {
            const {id} = req.params;
            const product = await ProductModel.findById(id)

            return res.status(200).json({
                status : "success",
                product_detail : product
            });

        } catch (error) {
            
            return res.status(500).json(error);

        }

    },

    commentsProduct : async (req, res) => {
        
        try {

            const query = {};
            const {id} = req.params;                                    
            query.prd_id = id

            const limit     = Number(req.query.limit) || 2
            const current_page = parseInt(req.query.page) || 1;
            const skip      = current_page * limit - limit;
            const comment_list = await CommentModel.find(query)
                                        .sort({ _id : -1 })
                                        .skip(skip)
                                        .limit(limit);

            return res.status(200).json({
                status : "success",
                filters : {
                    featured : req.query.featured || null,
                    limit,
                    current_page
                },
                paging : await pagingation(current_page, limit, CommentModel, query),
                data : comment_list
            })

        } catch (error) {
            return res.status(500).json(error)
        }
    },

    storeCommentProduct : async (req,res) => {

        try {
            
            const {id} = req.params;
            const {body} = req;

            const comment = {
                prd_id    : id,
                email     : body.email,
                full_name : body.full_name,
                body      : body.body
            }
            
            await new CommentModel(comment).save();            


            return res.status(201).json({
                status : "success"
            })

        } catch (error) {
            return res.status(500).json(error)
        }

    }

}