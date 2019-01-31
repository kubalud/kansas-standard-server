let passport = require('passport');
let app = require('./../app');
let LocalStrategy = require('passport-local').Strategy;
const consoleConfig = require('./../config/console');
const dbConfig = require('./../config/db');
let User = require('./models/user');

app.use(passport.initialize());

const {
    userNotFound: loginUserNotFoundMessage,
    invalidPassword: loginInvalidPasswordMessage
} = consoleConfig.messages.errors.login;

passport.use(new LocalStrategy({
        usernameField: dbConfig.passportUsernameField
    }, (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: loginUserNotFoundMessage
                })
            }
            if (!user.validPassword(user, password)) {
                return done(null, false, {
                    message: loginInvalidPasswordMessage
                });
            }
            return done(null, user);
        })
    }
));