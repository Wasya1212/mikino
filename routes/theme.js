var User = require('../models/user');

module.exports.postSave = function(req, res, next) {    
    var textColor = req.body.textColor,
        nameColor = req.body.nameColor,
        descriptionColor = req.body.descriptionColor,
        backgroundColor = req.body.backgroundColor,
        backgroundImage = req.user.backgroundImage,
        avatarImage = req.user.avatar;
        
    if (req.files && req.files.uploadedBackground) {
        backgroundImage = req.files.uploadedBackground[0].filename;
    }
    
    if (req.files && req.files.uploadedAvatar) {
        avatarImage = req.files.uploadedAvatar[0].filename;
    }
    
    console.log(backgroundImage);
    console.log(avatarImage);
    
    User.findByIdAndUpdate(req.user._id, {$set: {
        avatar: avatarImage,
        backgroundImage: backgroundImage,
        theme: {
            articleColor: nameColor,
            descriptionColor: descriptionColor,
            backgroundColor: backgroundColor,
            textColor: textColor
        }
    }}, function(err, user) {
        if (err) {
            console.log(err.message);
            res.send({error: err.message});
            next();
        }
        
        if (!user) {
            res.send({error: 'user not founded. Try again...'});
            next();
        }
        
        res.send({user: user});
        next();
    });
}