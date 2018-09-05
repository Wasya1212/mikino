var User = require('../models/user');

module.exports.get = function(req, res, next) {
    res.render('pages/photos', {
        currentUser: req.user
    });
    
    next();
}

module.exports.uploadPhoto = function(req, res, next) {
    if (!req.files[0]) {
        console.log('no image');
        res.send({error: 'no image file try again'});
        next();
    }
    
    User.findByIdAndUpdate(req.user._id, {$push: {photos: req.files[0].filename}}, function(err, user) {
        if (err) {
            res.send({error: err.message});
            next();
        }
        
        console.log('success image uploading');
        res.send({file: req.files[0]});
        next();
    });
}