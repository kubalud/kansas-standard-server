let passport = require('passport');
let User = require('./../db/models/user');
let errorHandler = require('./error-handler');
const consoleConfig = require('./../config/console');

const {
    createDuplicateAttempt: createDuplicateAttemptErrorMessage
} = consoleConfig.messages.errors.crud;

module.exports.register = (req, res) => {
    let user = new User();

    user.email = req.body.email;
    user.setHash(user, req.body.password);
    user.save((err) => {
        if (err && err.code === 11000) {
            errorHandler(
                createDuplicateAttemptErrorMessage,
                err,
                res.send.bind(res)
            );
        } else {
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