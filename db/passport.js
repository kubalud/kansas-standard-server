let passport = require('passport');
let app = require('./../app');
let LocalStrategy = require('passport-local').Strategy;
const consoleConfig = require('./../config/console');
const logger = require('./../services/logger');
const dbConfig = require('./../config/db');

let {
    models,
    passportUsernameField
} = dbConfig;

let User = require('./connection').model(models.user);

app.use(passport.initialize());

passport.use(new LocalStrategy({
        usernameField: passportUsernameField
    }, (field, password, done) => {
        User.findOne({ [passportUsernameField]: field }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('pp');
                logger(
                    consoleConfig.messages.failure.noSuchUser,
                    consoleConfig.colors.failure
                );
                return done(null, false, {
                    message: consoleConfig.messages.failure.noSuchUser
                })
            }
            if (!user.validPassword(user, password)) {
                logger(
                    consoleConfig.messages.failure.invalidPassword,
                    consoleConfig.colors.failure
                );
                return done(null, false, {
                    message: consoleConfig.messages.failure.invalidPassword
                });
            }
            return done(null, user);
        })
    }
));