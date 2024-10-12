const express   = require("express");
const app       = express();
const config    = require("config")
const session   = require('express-session')
const cookieParser = require('cookie-parser');
const { connecttionRedis } = require('../common/init.redis')



/**
 * Connect Redis
*/
connecttionRedis();




/**
 * Config Form Data
*/
app.use(express.urlencoded( { extended: true } ));
app.use(express.json());



/**
 * Config Template: Ejs
*/
app.set( "views" , config.get("app.viewsFolder"));
app.set( "view engine",  config.get("app.viewEngine"));


/**
 * Config Session
 * */ 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: config.get('app.sessionKey'),
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false 
    }
}))



/**
 * Config Cookie Parser
 * */ 
app.use(cookieParser())



/**
 * app.use("key", "url tuyệt đối tới thư mục data tĩnh");
*/
app.use("/static", express.static( config.get("app.staticFolder") ));

/**
 * Config Base Image Url
*/
app.use("/asset/upload/images", express.static(config.get("app.baseImageUrl")));



/**
 * Config Rounter
*/
app.use(require(config.get("app.rounter")));

app.use(config.get('app.prefixApiVersion'), require('../routers/api'));


module.exports = app;