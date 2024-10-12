const CategoryModel = require('../models/category')
const Paging        = require('../../common/paginate');
const { json }      = require('express');
const Module        = 'category';
const slug          = require('slug');
const path          = require('path');
const fs            = require('fs');

const Categories = {
    
    categories : async(req, res) => {

        const current_page  = parseInt(req.query.page) || 1;
        const limit         = 10;
        const skip          = current_page * limit - limit;
        const categories    = await CategoryModel.find()
                                .skip(skip)
                                .limit(limit)
                                .sort({ _id: -1}) // Sort ( -1: mới thêm; 1: cũ nhất)
        
        const total      = await CategoryModel.find().countDocuments();
        const total_page = Math.ceil(total / limit);
        const paging     = Paging(total_page, current_page, req.route.path);
        
        const page = {            
            categories : categories,
            paging : paging,
        }

        res.render('../views/admin/categories/category', {
            page,
            Module
        });
    },

    create : async (req, res) => {
        const error = (req._parsedUrl.search) ? 1 : 0;

        const page = {
            error : error
        }

        res.render('../views/admin/categories/add_category', {
            Module, 
            page
        });
    }, 

    store : async (req, res) => {
        const {body} = req;
        const check_title = await CategoryModel.findOne( {title: body.title.trim()} )

        if (check_title) {
            
            return res.redirect('/admin/categories/create?error=1')

        } else {
            const category = {
                title   : body.title,            
                slug    : slug(body.title)
            }
                
            await new CategoryModel(category).save();
            res.redirect('/admin/categories')
            
        }
    },    

    edit : async (req, res) => {
        const {id} = req.params
        const category = await CategoryModel.findById({ _id: id})
        const error = (req._parsedUrl.search) ? 1 : 0;
        
        const page = {
            category_info : category,
            error : error
        }
        res.render('../views/admin/categories/edit_category', {
            page,
            Module
        });
    }, 

    update : async (req, res) => {
        const {body} = req;
        const {id} = req.params;
        const check_title = await CategoryModel.findOne( {title: body.title.trim()} )
        
        if (check_title) {
            
            return res.redirect(`/admin/categories/edit/${id}?error=1`)

        } else {
            const category = {
                title   : body.title,            
                slug    : slug(body.title)
            }
            
            await CategoryModel.updateOne(
                { _id: id },
                category
            );
            
            res.redirect('/admin/categories')
            
        }
    },

    delete : async (req, res) => {
        const {id} = req.params;
        await CategoryModel.deleteOne( {_id: id} )
        res.redirect('/admin/categories')
    }

}

module.exports = Categories;
