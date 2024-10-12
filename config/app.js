module.exports = {
    serverPort      : process.env.SERVER_PORT || 8000,
    prefixApiVersion : process.env.PREFIX_API_VERSION || "/api/v1",    
    jwt_accessKey   : process.env.JWT_ACCESS_KEY || 'vietproAccessKey',
    jwt_refreshKey  : process.env.JWT_REFRESH_KEY || 'vietproRefreshKey',
    rounter         : `${__dirname}/../src/routers/web`,
    staticFolder    : `${__dirname}/../src/public/`,
    viewsFolder     : `${__dirname}/../src/apps/views/`,
    viewEngine      : "ejs",
    tmpUpload       : `${__dirname}/../src/tmp`,
    sessionKey      : "duc_session",
    baseImageUrl    : `${__dirname}/../src/public/uploads/images`,
    
}