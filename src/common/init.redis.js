const { createClient } = require('redis');

const client = createClient({
    url: "redis://default:VYEtsPIFpRFIpvaIAhbvWa5APSPRVBFY@redis-14835.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com:14835"
    /* url: redis://{username}:{password}@{port} */
})

client.on("error", (error) => console.log("Redis client error", error));

const connecttionRedis = () => {
    return client.connect()
        .then(() => console.log("Redis Connected"))
        .catch((error) => console.log(error))
}

module.exports = {
    connecttionRedis,
    redisClient: client
}