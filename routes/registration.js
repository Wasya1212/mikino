var countries = require('../config/index').use('countries.json').get('countries');
var secrets = require('../config/index').use('secrets.json').get('secret strings');
var User = require('../models/user');
var async = require('async');

module.exports.get = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.render('registration', {
            countries: countries,
            secrets: secrets
        });
    } else {
        res.redirect('/');
        next();
    }
}


module.exports.post = function(req, res) {
    var mail = req.body.mail;
    var password = req.body.password;
    var confirm_password = req.body['confirm-password'];
    
    // Validation
    req.assert('password', 'password is required').notEmpty();
    req.assert('mail', 'mail is required').notEmpty()
    req.assert('mail', 'must be a email').isEmail()
    req.assert('password', '6 - 20 characters required').len(6, 20);
    req.assert('confirm-password', 'dosent equal pass').equals(password);
    req.assert('mail', 'mail can`t equal the password').notEquals(password);
    
    var errors = req.validationErrors();
    
    if (errors) {
       res.send({
           errors: errors
       });
    } else {
        console.log(req.body);
        
        async.waterfall( [function(callback) {
            User.findUserByUsername(mail, function(err, user) {
                if (err) return callback(err);

                if (user) {
                    callback(null, false);
                } else {
                    var newUser = new User({
                        email: mail,
                        password: password
                    });

                    User.createUser(newUser, function(err, user) {
                        if (err) return callback(err);

                        console.log(user._id);
                        newUser.id = user._id;
                        
                        callback(null, newUser);
                    });
                }            
            });
        }], function(err, newUser) {
            
            if (err) console.error(err);
            
            if (newUser) {
                res.send({userId: newUser.id});
            } else {
                res.send({
                    errors: [{msg: 'User 2 already is registrated. Try to login...'}]
                });
            }  
            
        });
    }
}

module.exports.postName = function(req, res) {
    var fName = req.body.fName;
    var mName = req.body.mName;
    var lName = req.body.lName;
    
    // Validation
    req.assert('fName', 'first name is required').notEmpty();
    req.assert('fName', 'first 2 - 30 characters required').len(2, 30);
    
    var errors = req.validationErrors();
    
    if (errors) {
       res.send({
           errors: errors
       });
    } else {
        //console.log(req.body);
        
        User.findByIdAndUpdate(req.body.userId, { $set: { name: {
            lName: lName,
            fName: fName,
            mName: mName
        } } }, { new: true }, function (err, user) {
            if (err) console.error(err);
        });
        
        res.send({});
    }
}

module.exports.postAvatar = function(req, res) {
    
    if (req.files[0] === undefined || !req.files) {    
        res.send({
            errors: [{msg: 'image is required'}]
        });
    } else {        
        //console.log(req.files[0].filename);
        //console.log(req.body.userId);
        
        User.findByIdAndUpdate(req.body.userId, { $set: { avatar: req.files[0].filename } }, { new: true }, function (err, user) {
            if (err) console.error(err);
        });
        
        res.send({});
    }
}

module.exports.postAbout = function(req, res) {
    var birth = req.body.birth;
    var sex = req.body.sex;
    var about = req.body.about;
    
    req.assert('sex', 'sex must be required').notEmpty();
    //req.assert('birth', 'birth is required').notEmpty();*/
        
    var errors = req.validationErrors();
    
    if (errors) {
        res.send({
            errors: errors
        });
    } else {
        //console.log(req.body);
        
        User.findByIdAndUpdate(req.body.userId, { $set: { privateInfo: {
            birth: birth,
            sex: sex,
            about: about
        } } }, { new: true }, function (err, user) {
            if (err) console.error(err);
        });
        
        res.send({});
    }
}

module.exports.postInfo = function(req, res) {
    var phone = req.body.phone;
    var country = req.body.country;
    var city = req.body.sity;
    
    req.assert('phone', 'phone must be required').notEmpty();
    req.assert('phone', 'phone must be a real phone number').notEquals("+380 (99) 999-9999");
    req.assert('country', 'country must be required').notEmpty();
        
    var errors = req.validationErrors();
    
    if (errors) {
        res.send({
            errors: errors
        })
    } else {
        //console.log(req.body);
        
        User.findByIdAndUpdate(req.body.userId, { $set: { contactsInfo: {
            phone: phone,
            country: country,
            city: city
        } } }, { new: true }, function (err, user) {
            if (err) console.error(err);
        });
        
        res.send({});
    }
}

module.exports.postSecret = function(req, res) {
    var secret = req.body.secretQuestion;
    var answer = req.body.secretAnswer;
    
    req.assert('secretQuestion', 'secret must be required').notEmpty();
    req.assert('secretAnswer', 'answer must be required').notEmpty();
    
    var errors = req.validationErrors();
    
    if (errors) {
        res.send({
            errors: errors
        })
    } else {
        //console.log(req.body);
        
        User.findByIdAndUpdate(req.body.userId, { $set: { secret: {
            question: secret,
            answer: answer
        } } }, { new: true }, function (err, user) {
            if (err) console.error(err);
        });
        
        res.send({});
    }
}