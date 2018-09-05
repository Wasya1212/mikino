var mongoose = require('../libs/mongoose');

var MessageSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    text: {
        type: String,
        default: ''
    },
    data: [{
        contentType: { // !!!!!!!! check for required. DONT FORGET
            type: String      
        }, // type of content - media, repost, audio, document, url...
        text: {
            type: String
        }
    }]
});

var Message = module.exports = mongoose.model('Message', MessageSchema);

module.exports.createMessage = function(newMessage, callback) {
    newMessage.save(callback);
}