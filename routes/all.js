module.exports.get = function(req, res, next) {    
    if (!req.isAuthenticated()) {
        res.redirect('login');
    } else {
        next();
    }
}