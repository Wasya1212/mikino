// var mongoose = require('mongoose');
//
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/demo');
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
//
// module.exports = mongoose;

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose
  .connect("mongodb://wasya1212:wasya1212cool@ds145562.mlab.com:45562/mikino", { useNewUrlParser: false })
  .then(() => {
    console.log("MongoDb connected...");
  })
  .catch(err => {
    console.error(err);
  });

module.exports = mongoose;
