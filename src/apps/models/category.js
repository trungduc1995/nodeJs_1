const mongoose = require('../../common/database')();

const categorySchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
        },
        slug : {
            type: String,
            required: false,
        },
        description : {
            type: String,
            default : null,
        }
    },
    { timestamps : true }
);

// mongoose.model( "tên tùy ý", Schema, "tên collection")
const CategoryModel = mongoose.model( "Categories", categorySchema, "categories");

module.exports = CategoryModel;