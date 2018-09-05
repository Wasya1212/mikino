var session = require('express-session');
var MongoStore = require('connect-mongo')(session),
    sessionStore = new MongoStore({ url: 'mongodb://wasya1212:wasya1212cool@ds145562.mlab.com:45562/mikino' });

module.exports = sessionStore;
