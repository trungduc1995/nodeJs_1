
const UserModel = require('../models/user');

const Auth = {

    login : (req, res) => {        
        
        res.render('../views/admin/login', { data: {} });

    },

    postLogin: async (req, res) => {        
        const {email, password} = req.body;
        let error;

        const user = await UserModel.findOne({
            email : email, 
            password : password
        });
        
        if(user) {
            req.session.email    = email;
            req.session.password = password;
            return res.redirect('/admin/dashboard');

        } else { 

            error = 'Tài khoản không hợp lệ !'
            res.render('../views/admin/login', { data: {error} })
            
        }
           
    },

    logout : (req, res) => {
        req.session.destroy();
        res.redirect('/admin/login')
    }, 

}

module.exports = Auth;
