const OrderModel = require('../../models/order');
const ProductModel = require('../../models/product');
const transporter  = require('../../../libs/transpoter');
const ejs   = require("ejs");
const path  = require('path');
const _     = require("lodash")

module.exports = {

    index : async (req, res) => {

        try {

            const {id} = req.params

            const orders = await OrderModel.find({customerId: id}).sort({_id: -1})

            return res.status(200).json({
                status: "ok",
                data: orders
            })

        } catch (error){
            return res.status(500).json(error)
        }

    },

    order : async (req,res) => {

        try {
            
            const order = req.body;
            const {items} = order;
            const prdIds = items.map( (item) => item.prd_id )
            const products = await ProductModel.find( {
                _id : { $in: prdIds }
            } )

            let newItems = [];
            for (let product of products) {
                const item  = _.find(
                    items,
                    {prd_id : product._id.toString() }
                )
                
                if(item) {
                    item.name = product.name
                    newItems.push(item)
                }
            }

            order.items = newItems;

            const html = await ejs.renderFile(
                path.join( req.app.get("views"), "site", "email.ejs" ),
                order
            )

            // /////////////
            await transporter.sendMail({
                from    : '"VietproStore" <quantrivietproshop@gmail.com>', // sender address
                to      : order.email, // list of receivers
                subject : "Xác nhận đơn hàng từ VietproStore", // Subject line                
                html// html body
            });
            
            
            await new OrderModel(order).save();            

            return res.status(201).json("create order successfully")

        } catch (error) {
            return res.status(500).json(error)
        }

    },


    orderDetail : async (req, res) => {

        try {

            const {id} = req.params
            const order = await OrderModel.findById(id)

            return res.status(200).json({
                status: 'ok',
                data: order
            })

        } catch (error) {
            return res.status(500).json(error)
        }

    },
    

    orderCancel : async (req,res) => {

        try {


            const {id} = req.params
            
            await OrderModel.updateOne(
                { _id: id},
                { status: 0 }
            )


            return res.status(201).json('Order Canceled')

        } catch (error) {
            return res.status(500).json(error)
        }

    }

}