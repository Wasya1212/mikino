var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Session = mongoose.model('Session', new Schema(), 'sessions');

module.exports.get = function(req, res) { 
    var userId = req.user._id;
    var socketIo = req.app.get('socketIo');
    var filter = {'session':{'$regex': '.*"user":"'+userId+'".*'}};
    
    req.flash('success_msg', 'You are logged out');
    req.logout();  
    req.session.destroy();
    res.redirect('/login');    

    Session.remove(filter,function(err, data){
        socketIo.to(userId).emit('user:logout');
    });
}

// create token authentication