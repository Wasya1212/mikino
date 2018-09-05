module.exports.get = function(req, res, next) {
    res.render('pages/news', {
        currentUser: req.user
    });
    
    next();
}