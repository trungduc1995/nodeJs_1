const UserModel = require('../models/user')
const Paging    = require('../../common/paginate');
const Module    = 'user';


const Users = {
    user : async (req, res) => {

        const current_page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = current_page * limit - limit;
        const userList = await UserModel.find()
                        .skip(skip)
                        .limit(limit)
                        .sort({ _id: -1})
        
        const total     = await UserModel.find().countDocuments();
        const total_page = Math.ceil(total / limit);
        const paging     = Paging(total_page, current_page, req.route.path);

        const page = {
            user_list   : userList,
            module      : Module,
            paging      : paging
        };

        res.render('../views/admin/users/user', {
            page,
            Module
        })
    },

    create : (req, res) => {
        const error = (req._parsedUrl.search) ? 1 : 0;

        res.render('../views/admin/users/add_user', {
            Module,
            error
        })
    },

    store :  async (req, res) => {
        const {body} = req;
        const user_info = await UserModel.findOne( {email: body.email.trim()} )
        
        if (user_info) {
            
            return res.redirect('/admin/users/create?error=1')

        } else {
            const user = {
                email       : body.email.trim(),
                password    : body.password,
                role        : body.role,
                full_name   : body.full_name
            }
            
            if(user) {
                await UserModel(user).save();
                res.redirect('/admin/users')
            }
        }
    },

    edit : async (req, res) => {
        const {id} = req.params;
        const user = await UserModel.findOne( {_id : id})
        const error = (req.query) ? req.query.error : 0;

        const page = {
            user_info   : user,
            module      : Module,
            error       : error
        };
        
        res.render('../views/admin/users/edit_user', {
            page,
            Module
        })
    },

    update :  async (req, res) => {
        const {body} = req;
        const user_info = await UserModel.findOne( {email: body.email.trim()} )
        const {id} = req.params;
        
        if (body.password != body.re_password ) {
            
            return res.redirect(`/admin/users/edit/${id}?error=2`)

        } else {
            const user = {
                email       : body.email.trim(),
                password    : body.password,
                role        : body.role,
                full_name   : body.full_name
            }
            
            if(user) {                
                await UserModel.updateOne(
                    { _id: id },
                    user
                );
                res.redirect('/admin/users')
            }
        }
    },
    
    delete : async(req, res) => {
        const {id} = req.params;
        await UserModel.deleteOne( {_id: id} )
        res.redirect('/admin/users')
    },
    
}

module.exports = Users;
