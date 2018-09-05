var mongoose = require('../libs/mongoose');
var path = require('path');
var fs = require('fs');
var async = require("async");
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
    //FMPEG_PATH = path.resolve(__dirname, '../middleware/ffmpeg/bin');
    //FMPEG_PATH = path.resolve(__dirname, '../middleware/ffmpeg-3.3.1');
    //FMPEG_PATH = 'home/ubuntu/workspace/ffmpeg';

//ffmpeg.setFfprobePath(FMPEG_PATH + '/ffprobe');
//ffmpeg.setFfmpegPath(FMPEG_PATH + '/ffmpeg');

ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

var VideoSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mime: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    owner: mongoose.Schema.Types.ObjectId,
    metadata: {},
    screenshots: Array
});

var Video = module.exports = mongoose.model('Video', VideoSchema);

/*module.exports.createVideo = function(newVideo, callback) {
    newVideo.mime = newVideo.mime.split('/')[1];
    
    var mimelen = newVideo.mime.length;
    var titlelen = newVideo.title.length - (mimelen + 1);
    var filenamelen = newVideo.filename.length - (mimelen + 1);
    
    newVideo.title = newVideo.title.substring(titlelen, -titlelen);
    newVideo.filename = newVideo.filename.substring(filenamelen, -filenamelen);
    
    newVideo.save(callback);
}*/

module.exports.createVideo = async function(newVideo, callback) {
    newVideo.mime = newVideo.mime.split('/')[1];
    
    var mimelen = newVideo.mime.length;
    var titlelen = newVideo.title.length - (mimelen + 1);
    var filenamelen = newVideo.filename.length - (mimelen + 1);
    
    newVideo.title = newVideo.title.substring(titlelen, -titlelen);
    newVideo.filename = newVideo.filename.substring(filenamelen, -filenamelen);
    
    console.log('Trying get sync metadata...');
    
    let videoData = await getMetadataSync(newVideo);
    
    newVideo.metadata = videoData.metadata;
    newVideo.screenshots = videoData.screenshots;
    
    console.log('Try to save..');
    
    newVideo.save(function(err, video) {
        console.log('you save the video bich');
             
        let fullVideo = Video.setMetadata(video, video.metadata);
                
        callback(null, fullVideo);
    });
}

async function getMetadataSync(video) {
    var screenshots = [],
        screenshotsPath = path.resolve(__dirname, '../public/uploads') + '/screenshots/',
        screenshotsSize = '320x180';
    
    console.log('Creating screenshots...');
    
    /*async.waterfall([function(callback){
        console.log('Waterfall');
        console.log(video.path);
        
        var fullpath = path.resolve(__dirname, '../' + video.path);
        console.log(fullpath);
        
        try {
            if (fs.existsSync(fullpath)) {
                console.log('Yes');
            } else {
                console.log('No');
            }
            ffmpeg.ffprobe(fullpath, function (err, metadata) {   
                console.log(err);
                console.log(metadata);
                callback(err, metadata);
            });
        } catch(err) {
            console.log('some error');
            console.log(err.message);
        }
    }], function(err, metadata) {
        if (err) console.log(err.message);
        console.log(metadata);
    });*/
    
    return await new Promise((resolve, reject) => {
        ffmpeg(video.path).screenshots({
            timestamps: [0.5, '3%', '6%', '10%', '15%', '20%', '30%', '35%', '45%', '60%', '70%', '85%'],
            folder: screenshotsPath,
            size: screenshotsSize,
            filename: video.filename + '-thumbnail-at-%s-seconds.png',
        }).on('filenames', function(filenames) {
            console.log('Get screenshots filenames');
            screenshots.push(filenames);
        }).on('end', function() {
            ffmpeg.ffprobe(video.path, (err, metadata) => {        
                if (err) {
                    console.log('error:');
                    console.log(err.message);
                    reject(err);
                }

                resolve({
                    metadata: metadata,
                    screenshots: screenshots
                });
            });
        });
    });
}

module.exports.setMetadata = function(video, metadata) {
    console.log('Set video metadata');
    
    return {
        video_stream: {
            width: metadata.streams[0].width || '',
            height: metadata.streams[0].height || '',
            codec_name: metadata.streams[0].codec_long_name || '',
            codec_tag_string: metadata.streams[0].codec_tag_string || '',
            time_base: metadata.streams[0].time_base || '',
            start_time: metadata.streams[0].start_time || '',
            start_pts: metadata.streams[0].start_pts || '',
            duration: metadata.streams[0].duration || '',
            duration_ts: metadata.streams[0].duration_ts || '',
            bit_rate: metadata.streams[0].bit_rate || '',
            max_bit_rate: metadata.streams[0].max_bit_rate || '',
            bits_per_raw: metadata.streams[0].bits_per_raw_sample || '',
            frames: metadata.streams[0].nb_frames || '',
            language: metadata.streams[0].tags.language || '',
            handler_name: metadata.streams[0].tags.handler_name || '',
            creation_time: metadata.streams[1].tags.creation_time || '',
            disposition: metadata.streams[0].disposition || ''
        },
        audio_stream: {
            codec_name: metadata.streams[1].codec_name || '',
            codec_tag_string: metadata.streams[1].codec_tag_string || '',
            chanels: metadata.streams[1].chanels || '',
            chanel_layout: metadata.streams[1].chanel_layout || '',
            start_pts: metadata.streams[1].start_pts || '',
            start_time: metadata.streams[1].start_time || '',
            duration_ts: metadata.streams[1].duration_ts || '',
            duration: metadata.streams[1].duration || '',
            bit_rate: metadata.streams[1].bit_rate || '',
            max_bit_rate: metadata.streams[1].max_bit_rate || '',
            frames: metadata.streams[1].nb_frames || '',
            language: metadata.streams[1].tags.language || '',
            handler_name: metadata.streams[1].tags.handler_name || '',
            creation_time: metadata.streams[1].tags.creation_time || '',
            disposition: metadata.streams[1].disposition || ''
        },
        _id: video._id,
        filename: video.filename || '',
        original_name: video.title || '',
        path: video.path || '',
        mime: video.mime || '',
        uploaded: video.created || '',
        owner: video.owner || '',
        description: video.description || '',
        views: video.views || '',
        format: metadata.format.format_name || '',
        format_full: metadata.format.format_long_name || '',
        start_time: metadata.format.start_time || '',
        duration: metadata.format.duration || '',
        size: metadata.format.size || '',
        bit_rate: metadata.format.bit_rate || '',
        probe_score: metadata.format.probe_score || '',
        creation_time: metadata.format.tags.creation_time || '',
        title: metadata.format.tags.title || '',
        artist: metadata.format.tags.artist || '',
        composer: metadata.format.tags.composer || '',
        date: metadata.format.tags.date || '',
        encoder: metadata.format.tags.encoder || '',
        screenshots: video.screenshots || []
    };
}

/*module.exports.getMetadates = async function(videos) {
    return await Promise.all(videos.filter((video) => fs.existsSync(video.path)).map(async function(video) {
            let metadata = await getMetadataSync(video);
            let fullVideo = Video.setMetadata(video, metadata);

            return fullVideo;
        })
    );
}*/