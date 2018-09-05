var Video = require('../models/video');
var User = require('../models/user');

var ffmetadata = require('ffmetadata');

//var ffmpeg = require('ffmpeg');

var fs = require('fs');
var util = require('util');
var PATH = require('path');

async function createVideos(videos) {
    let arr = await Video.getMetadates(videos);
    
    return await Promise.resolve(arr);
}

module.exports.get = function(req, res, next) {
    Video.find({_id: {$in: req.user.videos}}, function(err, videos) {
        if (err) {
            console.log(err);
            
            res.render('pages/videos', {
                currentUser: req.user,
                videos: []
            });
            return next();
        }
        
        if (!videos) {
            res.render('pages/videos', {
                currentUser: req.user,
                audios: []
            });
            return next();
        }
        
        /*createVideos(videos).then((fullVideos) => {
            console.log('before');
            fullVideos.forEach((fullVideo) => {
                console.log(fullVideo);
            });
            console.log('after');
            
            res.render('pages/videos', {
                currentUser: req.user,
                videos: fullVideos
            });

            console.log('videos sended back');
            
            next();
        });*/
        
        let fullVideos = videos.filter((video) => fs.existsSync(video.path)).map((checkedVideo) => {
            try {
                checkedVideo = Video.setMetadata(checkedVideo, checkedVideo.metadata);
            } catch (err) {
                console.log(err.message);
            } finally {
                return checkedVideo;
            }
        });
        
        /*videos.forEach((video) => {
            console.log(video.metadata || 'i: ');
        });*/
        
        //console.log(videos[0]);
        
        res.render('pages/videos', {
            currentUser: req.user,
            videos: fullVideos
        });

        //console.log('videos sended back');

        next();
        
        /*ffmetadata.read(videos[0].path, function(err, data) {
            if (err) console.log(err);
            console.log(data);
        });*/
        
        /*videos.forEach(function(video) {
            var process = new ffmpeg(video.path);
            //var process = new ffmpeg("C:\\Users\\ukrai\\Desktop\\Yousei Teikoku -  Kanzen Houkai Paradox.mp4");
        
            process.then(function (video) {
                // Video metadata
                console.log(video);
                //console.log(video.metadata);
                // FFmpeg configuration
                //console.log(video.info_configuration);
            }, function (err) {
                console.log('Video not found');
            });
        });*/
        
        /*var probe = require('node-ffprobe');
        probe.FFPROBE_PATH = "C:\\Users\\ukrai\\Desktop\\fprobe-1.1\\autogen";
        
        videos.forEach(function(video) {
            probe(video.path, function(err, probeData) {
                console.log(probeData);
            });
        });*/
        
        /*!!!!!!*/
        
        /*videos.forEach(function(video) {
            if (!fs.existsSync(video.path)) {
                console.log('file not found');
                
                video.metadata = [];
                return;
            }
                                    
            var metaObject = new Metalib(video.path);
            
            metaObject.get(function(metadata, err) {
                console.log(metadata);
            });
        });*/
    }).sort({created: -1});
}

/*module.exports.uploadVideo = function(req, res, next) {
    var video = req.files[0];
    var newVideo = Video({
        filename: video.filename,
        title: video.originalname,
        size: video.size,
        path: video.path,
        mime: video.mimetype,
        owner: req.user._id
    });

    Video.createVideo(newVideo, function(err, video) {
        if (err) {
            console.error(err.message);
            res.send({error: 'cant save video try again'});
            return next();
        }
        
        User.findByIdAndUpdate(req.user._id, {$push: {videos: video._id}}, (err, user) => {
            if (err) {
                console.error(err.message);
                res.send({error: 'cant save to user try again'});
                return next();
            }
            
            console.log('video upload');
            res.send({});
            next();
        });
    });
}*/

module.exports.uploadVideo = function(req, res, next) {
    var video = req.files[0];
    var newVideo = Video({
        filename: video.filename,
        title: video.originalname,
        size: video.size,
        path: video.path,
        mime: video.mimetype,
        owner: req.user._id
    });

    Video.createVideo(newVideo, function(err, video) {
        if (err) {
            console.error(err.message);
            res.send({error: 'cant save video try again'});
            return next();
        }
        
        User.findByIdAndUpdate(req.user._id, {$push: {videos: video._id}}, (err, user) => {
            if (err) {
                console.error(err.message);
                res.send({error: 'cant save to user try again'});
                return next();
            }
            
            console.log('video upload');
            res.send({});
            next();
        });
    });
}