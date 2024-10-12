const CustomerModel = require('../../models/customer');
const TokenModel = require('../../models/token');
const { jwtDecode } = require('jwt-decode')
const jwt = require('jsonwebtoken')
const config = require('config');
const { redisClient } = require('../../../common/init.redis')

const generateAccessToken = async (customer) => {
    return await jwt.sign(
        { _id: customer._id },
        config.get('app.jwt_accessKey'),
        { expiresIn: "1d" }
    )
}

const generateRefreshToken = async (customer) => {
    return await jwt.sign(
        { _id: customer._id },
        config.get('app.jwt_refreshKey'),
        { expiresIn: "1y" }
    )
}

const setTokenBlackList = (token) => {
    const decodeed = jwtDecode(token);
    
    if (decodeed.exp > (new Date() / 1000)) {

        redisClient.set(token, token ,{
            EXAT: decodeed.exp
        });
        
    }
}


module.exports = {
    registerCustomer: async (req, res) => {

        try {

            const { body } = req;

            const isEmail = await CustomerModel.findOne({
                email: body.email
            })
            if (isEmail) return res.status(401).json('Email exists')

            const isPhone = await CustomerModel.findOne({
                phone: body.phone
            })
            if (isPhone) return res.status(401).json('Phone exists')


            if (!isEmail && !isPhone) {
                await new CustomerModel(body).save();
                return res.status(201).json('Create Customer successfully')
            }

        } catch (error) {
            return res.status(500).json(error)
        }

    },

    customerLogin: async (req, res) => {

        try {

            const { email, password } = req.body;

            const isEmail = await CustomerModel.findOne({ email })
            if (!isEmail) return res.status(400).json('Email không tồn tại')

            const isPassword = isEmail.password === password;
            if (!isPassword) return res.status(400).json('Password sai')


            if (isEmail && isPassword) {

                const accessToken = await generateAccessToken(isEmail)
                const refreshToken = await generateRefreshToken(isEmail)

                const isToken = await TokenModel.findOne({
                    customerId : isEmail._id
                })

                if(isToken) {
                    setTokenBlackList(isToken.accessToken)
                    await TokenModel.deleteOne({
                        customerId: isEmail._id
                    })
                }


                // Insert token to DB
                await new TokenModel({
                    customerId: isEmail._id,
                    accessToken,
                    refreshToken,
                }).save()

                const { password, ...others } = isEmail._doc;

                res.cookie('refreshToken', refreshToken)

                return res.status(201).json({
                    data: others,
                    accessToken
                })
            }

        } catch (error) {

            res.status(500).json(error)

        }

    },

    customerLogout: async (req, res) => {

        try {

            const { id } = req.params;
            const isToken = await TokenModel.findOne({
                customerId: id
            })
            // Move accesstoken to Redis (dirty token)
            setTokenBlackList(isToken.accessToken)

            // Delete token from DB
            await TokenModel.deleteOne({
                customerId: id
            })            


            return res.status(200).json("Logged out Successfully !")

        } catch (error) {
            return res.status(500).json(error)
        }

    },

    requestRefreshToken: async (req, res) => {

        try {

            const { refreshToken } = req.cookies;

            if (!refreshToken) {

                return res.status(401).json("Authentication require")

            } else {

                jwt.verify(
                    refreshToken,
                    config.get("app.jwt_refreshKey"),
                    async (error, decode) => {
                        if (error) return res.status(401).json("Authentication require");

                        const newAccessToken = await generateAccessToken(decode);
                        return res.status(200).json({
                            accessToken: newAccessToken
                        })

                    }
                )

            }


        } catch (error) {

            return res.status(500).json(error)

        }

    }

}