var upload = require('../libs/multer');

module.exports = function(app) {
    
    // authorization
    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);
    app.get('/logout', require('./logout').get);
    
    // registration
    app.get('/registration', require('./registration').get);
    app.post('/registration', require('./registration').post);
    app.post('/registration/name', require('./registration').postName);
    app.post('/registration/avatar', upload.any(), require('./registration').postAvatar);
    app.post('/registration/about', require('./registration').postAbout);
    app.post('/registration/info', require('./registration').postInfo);
    app.post('/registration/secret', require('./registration').postSecret);
    
    // check auth
    app.all('/*', require('./all').get);
    
    // frontpage directory
    app.get('/', require('./frontpage').get);
    
    // another directories
    //setings
    app.get('/edit', require('./edit').get);
    app.post('/edit', require('./edit').post);
    
    // messages
    app.get('/messages', require('./message').get);
    app.post('/message', require('./message').post);
    
    // audios
    app.get('/audios', require('./audio').get);
    app.post('/audios/upload', upload.any(), require('./audio').uploadAudio);
    
    // videos
    app.get('/videos', require('./video').get);
    app.post('/videos/upload', upload.any(), require('./video').uploadVideo);
    
    // news
    app.get('/feed', require('./news').get);
    
    // photos
    app.get('/photos', require('./photo').get);
    app.post('/photo/upload', upload.any(), require('./photo').uploadPhoto);
    
    // friends
    app.get('/friends', require('./friends').get);
    app.post('/friends', require('./friends').post);
    app.post('/friendship', require('./friends').friendship);
    app.post('/confirm-friendship', require('./friends').confirmFriendship);
    app.post('/cancel-friendship', require('./friends').cancelFriendship);
    app.post('/end-friendship', require('./friends').endFriendship);
    
    // groups
    app.get('/groups', require('./groups').get);
    
    // users
    app.get('/users', require('./users').get);
    app.post('/user', require('./users').user);
    
    // user
    app.get('/:id', require('./frontpage').user);
    
    // theme
    app.post('/theme/save', upload.fields([{ name: 'uploadedBackground', maxCount: 1 }, { name: 'uploadedAvatar', maxCount: 1 }]), require('./theme').postSave);
}