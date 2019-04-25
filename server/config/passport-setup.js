require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');

// const User = require('../models/user-model');


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});



passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: process.env.DB_GOOGLEID,
        clientSecret: process.env.DB_CLIENTSECRET,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        console.log("passport callback function fired");
        console.log(profile);
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                // already have the user
                console.log('user already exists: ', currentUser);
              //  done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                }).save().then((newUser) => {
                    console.log("new user created: " + newUser);
                   // done(null, newUser);
                })
            }
        })
    })
);