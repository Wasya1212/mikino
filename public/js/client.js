var socket = io();

socket.on('connect', function() {
    console.log('connected');
});

socket.on('disconnect', function() {
    console.log('disconnected');
});

socket.on('new user', function() {
    console.log('new user is connected');
});

socket.on('disconnection', function() {
    console.log('one of use leave');
});

socket.on('user:logout', function() {
    window.location.href = '/';
});

function emitNewMessage(room, text, callback) {
    socket.emit('message', room, text, function(data) {
        callback(data);
    });
}