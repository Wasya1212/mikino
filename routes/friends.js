var async = require('async');
var User = require('../models/user');

module.exports.get = function(req, res, next) {
    var currentUser = req.user;
    var income = currentUser.friends.incomeRequests;
    var outcome = currentUser.friends.outcomeRequests;
    var friends = currentUser.friends.friends;
    
    async.parallel([
        function(callback) {
            User.find({_id: {$in: income} }, function(err, users) {
                callback(err, users);
            });
        },
        function(callback) {
            User.find({_id: {$in: outcome} }, function(err, users) {
                callback(err, users);
            });
        },
        function(callback) {
            User.find({_id: {$in: friends} }, function(err, users) {
                callback(err, users);
            });
        }
    ], function(err, results) {
        if (err) {
            console.log(err);
            
            res.redirect('/');
            return next();
        }
        
        res.render('pages/friends', {
            currentUser: currentUser,
            incomeRequests: results[0],
            outcomeRequests: results[1],
            friends: results[2]
        });
        
        next();
    });
}

module.exports.post = function(req, res, next) {
    User.find({_id: {$in: req.user.friends.friends}}, function(err, users) {
        if (err) {
            console.error(err.message);
            res.send(null);
            return next();
        }
        
        res.send(users);
        next();
    });
}

module.exports.friendship = function(req, res, next) {
    var currentUser = req.user;
    
    User.findByIdAndUpdate(currentUser._id, {$push: {'friends.outcomeRequests': req.body.userId}}, function(err, user) {
        if (err) console.log(err);
        
        console.log('success outcome');
        User.findByIdAndUpdate(req.body.userId, {$push: {'friends.incomeRequests': currentUser._id}}, function(err, user) {
            if (err) console.log(err);
            
            console.log('success income');
        });
    });
    
    res.send({ 
        succes: 'seccess friendship',
        currentUser: currentUser
    });
    
    next();
}

module.exports.confirmFriendship = function(req, res, next) {
    var currentUser = req.user;
    
    User.findByIdAndUpdate(
        req.body.userId,
        {
            $pull: {["friends.outcomeRequests"]: currentUser._id},
            $push: {'friends.friends': currentUser._id}
        }, 
        { multi: true },
        function(err, user) {
            if (err) console.log(err);
        }
    );
    
    User.findByIdAndUpdate(
        currentUser._id,
        {
            $pull: {["friends.incomeRequests"]: req.body.userId},
            $push: {'friends.friends': req.body.userId}
        }, 
        { multi: true },
        function(err, user) {
            if (err) console.log(err);
        }
    );
    
    console.log('confirm fiendship with :' + req.body.userId);
    
    res.send({ 
        success: 'success confirm friendship request',
        currentUser: currentUser
    });
    
    next();
}

module.exports.cancelFriendship = function(req, res, next) {
    var currentUser = req.user;

    User.findByIdAndUpdate(
        req.body.userId,
        {
            $pull: {["friends.incomeRequests"]: currentUser._id}
        }, 
        { multi: true },
        function(err, user) {
            if (err) console.log(err);
        }
    );
    
    User.findByIdAndUpdate(
        currentUser._id,
        {
            $pull: {["friends.outcomeRequests"]: req.body.userId}
        }, 
        { multi: true },
        function(err, user) {
            if (err) console.log(err);
        }
    );
    
    console.log('cancel friendship with :' + req.body.userId);
    
    res.send({ 
        success: 'success cancel friendship request',
        currentUser: currentUser
    });
    
    next();
}

module.exports.endFriendship = function(req, res, next) {
    var currentUser = req.user;
    
    User.findByIdAndUpdate(
        req.body.userId,
        {
            $push: {["friends.outcomeRequests"]: currentUser._id},
            $pull: {'friends.friends': currentUser._id}
        }, 
        { multi: true },
        function(err, user) {
            if (err) console.log(err);
        }
    );
    
    User.findByIdAndUpdate(
        currentUser._id,
        {
            $push: {["friends.incomeRequests"]: req.body.userId},
            $pull: {'friends.friends': req.body.userId}
        }, 
        { multi: true },
        function(err, user) {
            if (err) console.log(err);
        }
    );
    
    console.log('end friendship with :' + req.body.userId);
    
    res.send({ 
        success: 'success end friendship request',
        currentUser: currentUser
    });
    
    next();
}