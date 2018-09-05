var app = require('./express')();
var http = require('http');
var server = http.createServer(app);
var port = process.env.PORT || 5000;

// use web sockets
var io = require('./socket/index')(server);

app.set('socketIo', io);

// get all routes
require('./routes/index')(app);

server.listen(port, function() {
    console.log("Server work on port: " + port + "...");
});