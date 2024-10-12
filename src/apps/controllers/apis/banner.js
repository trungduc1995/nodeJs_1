const BannerModel = require('../../models/banner')

module.exports = {
    index: async (req,res) => {

        try {
            const query = {};
            if (req.query.public) {
                query.public = req.query.public     
            }
            
            if (req.query.position) {
                query.position = req.query.position     
            }
            
            
            const limit = Number(req.query.limit) || 10;
            const sort  = req.query.sort || 1;
            const banners = await BannerModel.find(query).sort( {_id: sort}).limit(limit);

            return res.status(200).json({
                status: "success",
                filter: {
                    limit,
                    sort,
                    public : query.public || null,
                    position : query.position || null
                },
                data : {
                    doc : banners
                }
            })

        } catch (error) {
            return res.status(500).json(error)
        }

    }
}