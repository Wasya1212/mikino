var countries = require('../config/index').use('countries.json').get('countries');
var secrets = require('../config/index').use('secrets.json').get('secret strings');
var User = require('../models/user');

module.exports.get = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('login');
    } else {
        res.render('pages/edit', {
            countries: countries,
            secrets: secrets,
            currentUser: req.user
        });
    }
    
    next();
}

module.exports.post = function(req, res, next) {        
    User.findByIdAndUpdate(req.user._id, { $set: { name: {
        fName: req.body['first-name'],
        mName: req.body['middle-name'],
        lName: req.body['last-name']
    }, privateInfo: {
        about: req.body.about,
        sex: req.body.sex,
        birth: req.body.birth
    }, contactsInfo: {
        city: req.body['sity'],
        country: req.body.country,
        phone: req.body.phone
    }, secret: {
        question: req.body.secret,
        answer: req.body.answer
    } } }, { new: true }, function (err, user) {
        if (err) console.error(err);
    });
    
    res.send({});
    
    next();
}