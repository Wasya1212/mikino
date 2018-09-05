var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        User.findUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Uknown user'});
            }
            
            User.comparePassword(password, user.password, function(err, isMath) {
                if (err) throw err;
                if (isMath) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findUserById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;