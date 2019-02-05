let path = require('path');
let passport = require('passport');
let errorHandler = require('./error-handler');
const consoleConfig = require('./../config/console');
let User = require('./../db/connection').model(require('./../config/db').models.user);

const {
    createDuplicateAttempt: createDuplicateAttemptErrorMessage,
    createFailed: createFailedErrorMessage
} = consoleConfig.messages.errors.crud;

module.exports.register = (data, res) => {
    let user = new User(data);
    user.setHash(user, data.password);
    user.save((err) => {
        if (err) {
            if (err.code === 11000) {
                errorHandler(createDuplicateAttemptErrorMessage, err);
                res.sendFile(path.resolve('public/retry-register.html'));
                return;
            }
            errorHandler(createFailedErrorMessage, err);
            res.send({
                type: 'error',
                message: createFailedErrorMessage,
                errorObj: err
            })
        } else {
            res.status(200);
            res.redirect(`/index?jwt=${user.generateJwt(user)}&email=${user.email}`);
        }
    });
};

module.exports.login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(404).json(err);
            return;
        }
        if (user) {
            res.status(200);
            res.redirect(`/index?jwt=${user.generateJwt(user)}&email=${user.email}`);
        } else {
            res.sendFile(path.resolve('public/retry-login.html'));
        }
    })(req, res);
};