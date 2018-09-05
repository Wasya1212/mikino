var async = require('async');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var sessionStore = require('../libs/sessionStore');
var User = require('../models/user');

var online_users_sessions = [];
var rooms = [];

var socketio = require('socket.io');
var io;

// get (passport) session
function loadSession(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if (arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

// find user by session
function loadUser(session, callback) {
    // check auth
    if (!session.user) {
        return callback(null, null);
    }
    
    // find user by id 
    User.findUserById(session.user, function(err, user) {
        if (err) return callback(err);
        
        // user not found
        if (!user) {
            return callback(null, null);
        }
        
        callback(null, user);
    });
}

module.exports = function(server) {
    io = socketio.listen(server);
    
    io.use(function(socket, next) {
        var handshakeData = socket.request;
        
        async.waterfall([
            function(callback) {
                // get parsed sid cookie
                handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

                // current session 
                var sidCookie = handshakeData.cookie['connect.sid'];
                // get clear sid
                var sid = cookieParser.signedCookie(sidCookie, 'AnoHana');
                
                loadSession(sid, callback);
            },
            function(session, callback) {
                if (!session) {
                    callback('session not found')
                }
                
                handshakeData.session = session;
                // session.passport - current user ID in DB
                loadUser(session.passport, callback);
            },
            function(user, callback) {
                if (!user) {
                    callback('user not found');
                }
                
                handshakeData.user = user;
                callback(null)
            }
        ], function(err) {
            if (err) {
                console.log(err);
                //return next(err);
            }
            
            //console.log(socket.request.user);
            next();
        });
    }); // !!!!!!!!!!!!!!!!!!!!!!!!! handle errors must
    
    io.on('connection', function(socket) {
        if (socket.request.user) {
            var userId = socket.request.user._id;
        
            joinRoom(socket, userId);
            assignGuestName(socket);
            handleMessageBroadcasting(socket);
            handleFriendshipRequestsBroadcasting(socket);
            handleClientDisconnection(socket);
        } else {
            socket.emit('session:reload');
        }
        
    });
    
    return io;
}

// on user connection
function assignGuestName(socket) {
    socket.broadcast.emit('new user');
}

function joinRoom(socket, room) {
    socket.join(room);
    
    console.log('New user: ' + socket.id);
    
    // show sockets in room
    //console.log(socket.adapter.rooms[room]);
    // show all rooms
    //console.log(io.sockets.adapter.rooms);
}

// send message event
function handleMessageBroadcasting(socket) {
    socket.on('message', function(room, message, callback) {
        var sender = socket.request.user;
        
        io.to(room).emit('user message', {message: message, user: sender});
        io.to(sender._id).emit('new message', {message: message, user: sender});

        callback({result: 'success send'});
    });
}

// on user disconnection
function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        socket.broadcast.emit('disconnection');
        
        console.log('user disconnected: ' + socket.id);
    });
}

function handleFriendshipRequestsBroadcasting(socket) {
    socket.on('confirm friendship', function(room, user, callback) {
        console.log('confirm friendship socket with ' + room);
        io.to(room).emit('confirm friendship', user);
        
        callback({result: 'success send'});
    });
    
    socket.on('cancel friendship', function(room, user, callback) {
        console.log('cancel friendship socket with ' + room);
        io.to(room).emit('cancel friendship', user);
        
        callback({result: 'success send'});
    });
    
    socket.on('friendship', function(room, user, callback) {
        console.log('friendship socket with ' + room);
        io.to(room).emit('friendship', user);
        
        callback({result: 'success send'});
    });
    
    socket.on('end friendship', function(room, user, callback) {
        io.to(room).emit('end friendship', user);
        console.log('end friendship socket with ' + room);
        
        callback({result: 'success send'});
    });
}

// socket io can inform about online users by active sockets id