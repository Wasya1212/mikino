var backup = require('mongodb-backup');
var backupParams = require('./config/index');

backup({
    uri: backupParams.get('uri'),
    root: __dirname + backupParams.get('root')
});