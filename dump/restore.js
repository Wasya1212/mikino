var restore = require('mongodb-restore');
var restoreParams = require('./config/index');

restore({
  uri: restoreParams.get('uri'),
  root: __dirname + '/' + restoreParams.get('root') + '/' + restoreParams.get('dbName')
});