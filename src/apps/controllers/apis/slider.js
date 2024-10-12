const SliderModel = require('../../models/slider')

module.exports = {
    index: async(req, res) => {

        try {

            const limit = Number(req.query.limit) || 5;
            const sort  = Number(req.query.sort) || 1;

            const slider = await SliderModel.find()
                                            .sort({_id: sort})
                                            .limit(limit);

            return res.status(200).json({
                status: "success",
                filter : {
                    limit,
                    sort,
                },
                data: {
                    doc: slider
                }
            })

        } catch(error){
            return res.status(500).json(error)
        }

    }
}