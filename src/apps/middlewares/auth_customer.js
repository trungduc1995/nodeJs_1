const jwt = require('jsonwebtoken');
const config = require('config')
const { redisClient } = require('../../common/init.redis')

module.exports = {

    verifyAuthentication: async (req, res, next) => {

        try {
            const verifyToken = req.headers["token"];

            if (!verifyToken) {

                return res.status(401).json('Authentication require');

            } else {

                const accessToken = verifyToken.split(' ')[1];

                // Check dirty token
                const dirtyToken = await redisClient.get(accessToken)
                if (dirtyToken) return res.status(401).json('Dirty Token');

                // Verify Token
                jwt.verify(
                    accessToken,
                    config.get("app.jwt_accessKey"),
                    (err, decode) => {

                        if (err) {
                            return res.status(401).json('Authentication require');
                        }

                        next();
                    }
                );

            }

        } catch (error) {

            res.status(500).json(error)

        }

    }

}