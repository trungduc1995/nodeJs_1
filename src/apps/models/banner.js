const mongoose = require("../../common/database")();
const bannerSchema = new mongoose.Schema(
    {
        image: {
            type : String,
            required: true
        },
        position: {
            type : Number,
            required: true
        },
        public: {
            type : Boolean,
            default: true
        },
        target : {
            type: Boolean,
            required: true,   
        },
        url : {
            type: String,
            required: true,   
        }
    },
    {timestamps: true}
)

const BannerModel = mongoose.model("banners", bannerSchema, "banners")

module.exports = BannerModel