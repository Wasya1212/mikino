module.exports.get = function(req, res, next) {
    res.render('pages/groups', {
        currentUser: req.user
    });
    
    next();
}