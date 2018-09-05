var Audio = require('../models/audio');
var User = require('../models/user');
var async = require('async');

module.exports.get = function(req, res, next) {
    Audio.find({_id: {$in: req.user.audios.all}}, function(err, audios) {
        if (err) {
            console.log(err);
            
            res.render('pages/audios', {
                currentUser: req.user,
                audios: req.user.audios.all
            });
            return next();
        }
        
        if (!audios) {
            res.render('pages/audios', {
                currentUser: req.user,
                audios: []
            });
            return next();
        }
        
        createAudios(audios).then((completeAudios) => {
            res.render('pages/audios', {
                currentUser: req.user,
                audios: completeAudios
            });
            
            //console.log(completeAudios[0]);
            
            next();
        });
    }).sort({created : -1});
}

async function createAudios(audios) {
    let arr = await Audio.getMetadates(audios);
    
    return await new Promise((resolve, reject) => {
        resolve(arr);
    });
}

async function gm(audio) {
    let a = await Audio.getMetadata(audio);
    
    return await new Promise((resolve, reject) => {
        resolve(a);
    });
}

module.exports.uploadAudio = function(req, res, next) {
    if (req.files[0] === undefined || !req.files) { 
        res.send({
            errors: [{msg: 'image is required'}]
        });
    } else {                        
        var audio = req.files[0];
        var newAudio = Audio({
            filename: audio.filename,
            title: audio.originalname,
            size: audio.size,
            path: audio.path,
            mime: audio.mimetype,
            owner: req.user._id
        });
                
        async.waterfall([
            function(callback) {
                createAudio(newAudio, callback)
            },
            function(audio, callback) {
                getMetadata(audio, callback);
            },
            function(audio, callback) {
                saveAudioToUser(req.user, audio, callback);
            }
        ], function(err, user, audio) {
            if (err) {
                console.error(err);
                res.send({error: err});
                return next();
            }
            
            res.send({audio: audio});
        });
    }
}

function createAudio(audio, callback) {
    Audio.createAudio(audio, function(err, newAudio) {
        if (err) {
            return callback(err, null);
        }
        
        if (!newAudio) {
            callback(null, null);
        } else {
            callback(null, newAudio);
        }
    });
}

function getMetadata(audio, callback) {
    if (!audio) return callback(new Error('cannot get audio'));
    
    Audio.getMetadata(audio.path, function(err, metadata) { 
        if (err) {
            return callback(err, null);
        }
        
        if (!metadata) {
            callback(null, null);
        } else {
            var newAudio = Audio.setMetadata(audio, metadata);
            
            callback(null, newAudio);
        }
    });
}

function saveAudioToUser(user, audio, callback) {
    if (!audio) {
        return callback(new Error('cant save audio'), null, null);
    }
    
    User.findByIdAndUpdate(user._id, {$push: {'audios.all': audio._id}}, function(err, user) {
        if (err) {
            return callback(err, null);
        }
        
        if (!user) {
            callback(null, null);
        } else {
            callback(null, user, audio);
        }
    });
}