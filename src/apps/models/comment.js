const mongoose = require('../../common/database')();

const commentSchema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true,
        },
        prd_id : {            
            type: mongoose.Types.ObjectId,
            required: true,
        },
        body : {
            type: String,
            required: true,
        },
        full_name : {
            type: String,
            required: true,
        },
    },
    { timestamps : true }
);

// mongoose.model( "tên tùy ý", Schema, "tên collection")
const CommentModel = mongoose.model( "Comments", commentSchema, "comments");

module.exports = CommentModel;