const mongoose = require("../../common/database")();

const tokenSchema = new mongoose.Schema({
    customerId : {
        type: mongoose.Types.ObjectId,
        require: true
    },
    accessToken : {
        type: String,
        require: true
    },
    refreshToken : {
        type: String,
        require: true
    }
})
const TokenModel = mongoose.model("Tokens", tokenSchema, 'tokens')
module.exports = TokenModel