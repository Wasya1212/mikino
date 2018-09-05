var country = require('../config/index').use('countries.json').get('countries');
var User = require('../models/user');
var Audio = require('../models/audio');
var Video = require('../models/video');
var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports.get = function(req, res, next) {    
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {        
        res.redirect('/' + req.user._id);
    }
    
    next();
}

Array.prototype.in_array = function(needle) {
    for(var i = 0, l = this.length; i < l; i++)  {
        if(this[i] == needle) {
            return true;
        }
    }
    return false;
}

async function createAudios(audios) {
    let arr = await Audio.getMetadates(audios);
    
    return await new Promise((resolve, reject) => {
        resolve(arr);
    });
}

module.exports.user = function(req, res, next) {     
    var id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next();
    }
    User.findUserById(id, function(err, user) {
        if (err) {
            console.log(err);
            res.send({error: err.message});
            return next();
        }

        if (!user) {
            res.send({error: new Error('user is not defined')});
            return next();
        }

        async.parallel({
            audios: function(callback) {
                if (!user.audios || !user.audios.all || user.audios.all.length == 0) {
                    return callback(null, []);
                }

                Audio.find({_id: {$in: user.audios.all}}, function(err, audios) {
                    createAudios(audios).then((completeAudios) => {
                        var sa = [];

                        if (completeAudios.length <= 5) {
                            sa = completeAudios;
                        } else {
                            for(let i = completeAudios.length - 1; i >= completeAudios.length - 5; i--) {
                                sa.push(completeAudios[i]);
                            }
                        }
                        
                        console.log(sa);
                        
                        callback(err, sa);
                    });
                }).sort({created : -1});
            },
            video: function(callback) {
                if (!user.videos || user.videos.length == 0) {
                    return callback(null, null);
                }

                Video.find({_id: {$in: user.videos}}, function(err, videos) {
                    let fullVideos = videos.filter((video) => fs.existsSync(video.path)).map((checkedVideo) => {
                        try {
                            checkedVideo = Video.setMetadata(checkedVideo, checkedVideo.metadata);
                        } catch (err) {
                            console.log(err.message);
                        } finally {
                            return checkedVideo;
                        }
                    });

                    callback(err, fullVideos[fullVideos.length - 1]);
                });
            },
            photos: function(callback) {
                if (user.photos.length == 0) {
                    return callback(null, []);
                }
                
                var ph = [];
                
                if (user.photos.length <= 6) {
                    ph = user.photos;
                } else {
                    for (var i = user.photos.length - 1; i >= user.photos.length - 6; i--) {
                        ph.push(user.photos[i]);
                    }
                }
                
                callback(null, ph);
            }
        }, function(err, results) {
            if (err) {
                res.send({error: err.message});
                return next();
            }

            var frendlyStatus = undefined;
            var currentUser = req.user;
            var administrator = true;

            if (id != req.user._id) {
                if (req.user.friends.outcomeRequests.in_array(id)) {
                    frendlyStatus = 'outcome';
                } else if (req.user.friends.incomeRequests.in_array(id)) {
                    frendlyStatus = 'income';
                } else if (req.user.friends.friends.in_array(id)) {
                    frendlyStatus = 'friend';
                } else {
                    frendlyStatus = 'none';
                }
                
                administrator = false;
            }

            //console.log(results);
            
            res.render('pages/frontpage', {
                currentUser: req.user,
                anoutherUser: user,
                audios: results.audios,
                video: results.video,
                photos: results.photos,
                administrator: administrator,
                frendlyStatus: frendlyStatus
            });

            next();
        });
    });
}

/*module.exports.user = function(req, res, next) {     
    var id = req.params.id;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
        if (id == req.user._id) {
            Audio.find({_id: {$in: req.user.audios.all}}, function(err, audios) {
                createAudios(audios).then((completeAudios) => {
                    var sa = [];
                    
                    for(let i = 0; i < 5; i++) {
                        sa.push(completeAudios[i]);
                    }
                    
                    res.render('pages/frontpage', {
                        currentUser: req.user,
                        administrator: true,
                        audios: sa
                    });
                    
                    next();
                });
            });
        } else {
            var frendlyStatus;
            
            if (req.user.friends.outcomeRequests.in_array(id)) {
                frendlyStatus = 'outcome';
            } else if (req.user.friends.incomeRequests.in_array(id)) {
                frendlyStatus = 'income';
            } else if (req.user.friends.friends.in_array(id)) {
                frendlyStatus = 'friend';
            } else {
                frendlyStatus = 'none';
            }
            
            User.findUserById(id, function(err, user) {
                if (err) console.log(err);

                if (!user) {
                    console.log('user not found');
                }

                res.render('pages/frontpage', {
                    currentUser: req.user,
                    anoutherUser: user,
                    administrator: false,
                    frendlyStatus: frendlyStatus
                });

                next();
            });
        }
        
    } else {
        next();
    }    
}*/

function createUserObj(user) {
    return {
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        _id: user._id,
        name: {
            fName: user.name.fName,
            mName: user.name.mName,
            lName: user.name.lName
        },
        info: {
            email: user.email,
            phone: user.contactsInfo.phone,
            country: user.contactsInfo.country,
            city: user.contactsInfo.city,
            birth: user.privateInfo.birth,
            sex: user.privateInfo.sex,
            about: user.privateInfo.about
        }
    };
}