var mongoose = require('../libs/mongoose');
var path = require('path');
var fs = require('fs');
var musicMetadataReader = require('musicmetadata');

var AudioSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
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
    owner: mongoose.Schema.Types.ObjectId
});

var Audio = module.exports = mongoose.model('Audio', AudioSchema);

module.exports.createAudio = function(newAudio, callback) {
    newAudio.mime = newAudio.mime.split('/')[1];
    
    var mimelen = newAudio.mime.length;
    var titlelen = newAudio.title.length - (mimelen + 1);
    var filenamelen = newAudio.filename.length - (mimelen + 1);
    
    newAudio.title = newAudio.title.substring(titlelen, -titlelen);
    newAudio.filename = newAudio.filename.substring(filenamelen, -filenamelen);
    
    newAudio.save(callback);
}

module.exports.setMetadata = function(audio, metadata) {
    return {
        filename: audio.filename,
        title: audio.title,
        size: audio.size,
        path: audio.path,
        mime: audio.mime,
        owner: audio.owner,
        _id: audio._id,
        created: audio.created,
        metadata: metadata
    };
}

module.exports.getMetadates = async function getMetadates(audios) {
    return await Promise.all(audios.filter((audio) => fs.existsSync(audio.path)).map(async function(audio) {
        let stream = fs.createReadStream(audio.path);
        let metadata = await getMetadataSync(stream);
        let fullAudio = Audio.setMetadata(audio, metadata);
    
        return fullAudio;
    }));
}

async function getMetadataSync(file) {        
    return await new Promise ((resolve, reject) => {
        musicMetadataReader(file, {duration: true}, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            if (metadata.picture.length > 0) {
                metadata.picture[0].base64String = getDecodedPicture(metadata.picture[0]);
            }
            
            resolve(metadata); 
        });
    });
}

function getDecodedPicture(picture) {
    var base64String = new Buffer(picture.data).toString('base64');
    var dataUrl = "data:image/" + picture.format + ";base64," + base64String;
    
    return dataUrl;
}

module.exports.getMetadata = function getMetadata(audioPath, callback) {  
    var stream = fs.createReadStream(audioPath);

    stream.on('error', function(err) {
        return callback(err, null)
    });

    var parser = musicMetadataReader(stream, {duration: true}, function (err, metadata) {
        if (err) {
            return callback(err, null);
        }

        if (!metadata) {
            return callback(null, null);
        }

        if (metadata.picture.length > 0) {
            var base64String = new Buffer(metadata.picture[0].data).toString('base64');
            var dataUrl = "data:image/" + metadata.picture[0].format + ";base64," + base64String;

            metadata.picture[0].base64String = dataUrl;
        }

        callback(null, metadata);
    });
}