var User = require('../models/user');

module.exports.get = function(req, res, next) {
    User.find({}, function(err, results) {
        if (err) console.log(err);
        
        res.render('pages/users', {
            currentUser: req.user,
            users: results
        });
        
        next();
    });
}

module.exports.user = function(req, res, next) {
    User.findUserById(req.body.userId || req.user._id, function(err, user) {
        if (err) {
            console.error(err.message);
            return next();
        }
        
        if (!user) {
            res.send({
                error: 'user not found',
                user: null
            });
        }
        
        res.send({ user: user });
        
        next();
    });
}