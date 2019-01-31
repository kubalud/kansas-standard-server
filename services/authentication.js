let passport = require('passport');
let User = require('./../db/setup').model('User');
let errorHandler = require('./error-handler');
const consoleConfig = require('./../config/console');

const {
    createDuplicateAttempt: createDuplicateAttemptErrorMessage,
    createFailed: createFailedErrorMessage
} = consoleConfig.messages.errors.crud;

module.exports.register = (data, res) => {
    User.create(data, (err) => {
        if (err) {
            console.log(err);
            if (err.code === 11000) {
                errorHandler(
                    createDuplicateAttemptErrorMessage,
                    err,
                    res.send.bind(res)
                );
            }
            errorHandler(
                createFailedErrorMessage,
                err,
                res.send.bind(res)
            );
        } else {
            console.log('succ');
            res.status(200);
            res.json({"token" : user.generateJwt(user)});
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
            res.json({"token" : user.generateJwt(user)});
        } else {
            res.status(401).json(info);
        }
    })(req, res);
};