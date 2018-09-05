var bcrypt = require('bcrypt');
var mongoose = require('../libs/mongoose');

var UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        fName: {
            type: String,
            default: 'User-' + Date.now()
        },
        mName: {
            type: String,
            default: ''
        },
        lName: {
            type: String,
            default: ''
        }
    },
    photos: [{
        type: String,
    }],
    messages: [{
        title: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId
        }, // contain message id
        properties: {
            hidden: {
                type: Boolean,
                default: false
            },
            new: {
                type: Boolean,
                default: true
            }
        }
    }],
    dialogues: { },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    audios: {
        all: [{
            type: mongoose.Schema.Types.ObjectId
        }]
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    friends: {
        incomeRequests: [{
            type: mongoose.Schema.Types.ObjectId
        }],
        outcomeRequests: [{
            type: mongoose.Schema.Types.ObjectId
        }],
        friends: [{
            type: mongoose.Schema.Types.ObjectId
        }]
    },
    admin: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    backgroundImage: {
        type: String, 
        default: 'background.jpg'
    },
    avatar: {
        type: String,
        default: 'acount-icon.png'
    },
    privateInfo: {
        birth: {
            type: String,
            default: ''
        },
        sex: {
            type: String,
            default: ''
        },
        about: {
            type: String,
            default: ''
        }
    },
    contactsInfo: {
        phone: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        }
    },
    secret: {
        question: {
            type: String,
            default: ''
        },
        answer: {
            type: String,
            default: ''
        }
    },
    theme: {
        articleColor: {
            type: String,
            default: '#2a2a2a'
        },
        descriptionColor: {
            type: String,
            default: '#484848'
        },
        backgroundColor: {
            type: String,
            default: '#ffffff'
        },
        textColor: {
            type: String,
            default: '#676767'
        }
    }
        /*,
    pageThem: {
        topBar: {
            fontColor: {
                focused: {
                    type: String,
                    default: undefined
                },
                static: {
                    type: String,
                    default: undefined
                }
            }
        },
        menu: {
            backgroundColor: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                default: undefined
            },
            fontColor: {
                focused: {
                    type: String,
                    default: undefined
                },
                static: {
                    type: String,
                    default: undefined
                }
            }
        },
        mailColor: {
            type: String,
            default: undefined
        }
    }*/
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.findUserByUsername = function(username, callback) {
    var query = {email: username};
    User.findOne(query, callback);
}

module.exports.findUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMath) {
         if (err) throw err;
        callback(null, isMath);
    });
}