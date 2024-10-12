const mongoose = require("../../common/database")();
const sliderSchema = new mongoose.Schema(
    {
        image : {
            type: String,
            required: true
        },
        position : {
            type: Number,
            required: true
        },
        public : {
            type: Boolean,
            default: true
        }
    }, 
    {
        timestamps: true
    }
)

const SliderModel = mongoose.model("Sliders", sliderSchema, "sliders")
module.exports = SliderModel