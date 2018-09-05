var passport = require('../libs/passport');

module.exports.get = function(req, res) {
    if (!req.isAuthenticated()) {
        res.render('login');
    } else {
        res.redirect('/');
        //next();
    }
}

module.exports.post = passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
});