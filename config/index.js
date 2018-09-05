var nconf = require('nconf');
var path = require('path');

module.exports.use = function(configFile) {
    nconf.argv()
       .env()
       .file({ file: path.join(__dirname + '/' + configFile) });
    
    return nconf;
}