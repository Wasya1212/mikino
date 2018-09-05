var mongoose = require('mongoose');
var Message = require('../models/message');
var User = require('../models/user');
var async = require('async');

module.exports.get = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        next();
    } else {
        var sel = req.query.sel;

        if (sel && mongoose.Types.ObjectId.isValid(sel) && sel != req.user._id) {
            var messages = [];
            
            if (req.user.dialogues && req.user.dialogues[sel]) {
                req.user.dialogues[sel].forEach(function(message) {
                    messages.push(message.id);
                });

                async.parallel([
                    function(callback) {
                        Message.find({_id: {$in: messages}}, function(err, msgs) {
                            callback(err, msgs);                    
                        });
                    },
                    function(callback) {
                        User.findById(sel, function(err, user) {
                            callback(err, user);
                        });
                    }
                ], function(err, results = []) {
                    if (err) {
                        console.log(err);
                        res.redirect('/messages');
                        return next();
                    }

                    res.render('pages/message', {
                        currentUser: req.user,
                        order: results[1],
                        messages: results[0]
                    });

                    next();
                });
            } else {
                res.render('pages/message', {
                    currentUser: req.user,
                    order: req.user,
                    messages: []
                });

                next();
            }
            
            
        } else {
            var dialogPersons = [];
            
            for(var person in req.user.dialogues) {
                dialogPersons.push(person);
            }
            
            User.find({_id: {$in: dialogPersons}}, function(err, persons) {
                if (err) console.log(err);

                res.render('pages/messages', {
                    currentUser: req.user,
                    dialogPersons: persons
                });
            });
        }        
    }
}

module.exports.post = function(req, res, next) {
    if (req.body.message && req.body.message != '') {
        var senderId = req.user._id;
        var orderId = req.body.order
        
        var newMessage = Message({
            text: req.body.message,
            to: orderId,
            from: senderId
        });
        
        async.waterfall([
            function(callback) {
                Message.createMessage(newMessage, function(err, message) {
                    if (err) {
                        return callback(err, null);
                    }
                    
                    callback(null, message);
                });
            },
            function(message, callback) {
                if (!message) return callback(null, null);
                    
                async.parallel([
                    function(callback) {
                        User.findByIdAndUpdate(
                            message.to, 
                            {$push: {['dialogues.' + message.from]: {id: message._id}} }, 
                            { safe: true, upsert: true }, 
                            function(err, user) {                                
                                callback(err, user)

                                //console.log('message saved to order');
                            }
                        );
                    },
                    function(callback) {
                        User.findByIdAndUpdate(
                            message.from, 
                            {$push: {['dialogues.' + message.to]: {id: message._id}} }, 
                            { safe: true, upsert: true }, 
                            function(err, user) {                                
                                callback(err, user)

                                //console.log('message saved to sender');
                            }
                        );
                    }
                ], function(err, results) {
                    if (err) return callback(err);
                                        
                    if (!results) {
                        callback(true, null);
                    } else {
                        callback(null, message);
                    }
                });
          
            }
        ], function(err, data) {
            if (err) console.log(err);
            
            if (data) {
                res.send({
                    data: data
                });
            } else {
                res.send({
                    error: 'message can`t be sended please try again',
                    data: 'faild'
                });
            }
            
            next();
        });
    }
}