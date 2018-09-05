var express = require('express');
var cookieSession = require('cookie-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var statics = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('./libs/passport');
var session = require('express-session');
var favicon = require('serve-favicon');

module.exports = function() {
    var app = express();
    
    // static foulder
    app.use(statics(path.join(__dirname, 'public')));
    
    //favicon icon
    app.use(favicon('public/img/favicon.png'));
    
    // parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json 
    app.use(bodyParser.json());
    
    // parse cookies
    app.use(cookieParser());
    
    // set engine
    app.set('views', __dirname + '/views');
    app.set('view engine', 'pug');
        
    //express sessions
    var sessionStore = require('./libs/sessionStore');
    
    app.use(session({
        secret: 'AnoHana',
        cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
        resave: true, 
        saveUninitialized: true,
        store: sessionStore
    }));
    
    // cookie sessions
    /*app.use(cookieSession({
        secret: 'sid',
        key: 'AnoHana'
    }));*/
    
    // validations
    app.use(expressValidator({
        customValidators: {
            notEquals: function(param, value) {
                return param != value;
            }
        },
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.'),
                root    = namespace.shift(),
                formParam = root;

            while(namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg   : msg,
                value : value
            };
        }
    }));
    
    // connect flash
    app.use(flash());
    
    // global vars
    app.use(function(req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });
    
    // headers
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    // passport initialization
    app.use(passport.initialize());
    app.use(passport.session());
    

    
    return app;
}