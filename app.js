let prompt = require('./services/prompt');

(async() => {
    await prompt();

    let express = require('express');
    let bodyParser = require('body-parser');
    let jwt = require('jsonwebtoken');
    let app = module.exports = express();
    let http = require('http').Server(app);
    let io = require('socket.io')(http);
    let authentication = require('./services/authentication');
    const jwtSecret = require('./config/secret').jwtSecret;
    const consoleConfig = require('./config/console');

    const errorHandler = require('./services/error-handler');
    const logger = require('./services/logger');


    let User = require('./db/connection').model(require('./config/db').models.user);

    let port = process.env.PORT || 3000;

    // Generic middleware
    app.use(express.static(require('path').join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    require('./db/passport');
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200");
        res.setHeader('Access-Control-Allow-Method', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
        next();
    });

    // Route middleware
    app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    });

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/public/register.html');
    });

    app.post('/login', (req, res) => {
        authentication.login(req, res);
    });

    app.post('/register', (req, res) => {
        authentication.register(req.body, res);
    });

    app.post('/logout', (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    });

    app.get('/index', (req, res) => {
        if (req.query.jwt) {
            if (jwt.verify(req.query.jwt, jwtSecret)) {
                res.sendFile(__dirname + '/public/app.html');
            } else {
                logger(
                    consoleConfig.colors.info,
                    consoleConfig.messages.handled.jwtExpired
                );
                res.redirect('/login');
            }
        } else {
            console.log('Attempted to access index with no JWT.')
            res.redirect('/login');
        }
    });

    app.post('/verification', (req, res) => {
        if (req.body) {
            let { jwt: token, email } = req.body;
            if (token && email) {
                User.find({ email: email }, (err, data) => {
                    if (err) {
                        errorHandler(
                            consoleConfig.messages.errors.crud.findUserFailed,
                            err
                        );
                        res.send('DB ERROR');
                    } else if (data && data.length) {
                        logger(
                            consoleConfig.messages.success.usersReadMessage,
                            consoleConfig.colors.info
                        );
                        res.redirect(`/index?jwt=${token}&email=${email}`);
                    } else {
                        errorHandler(
                            consoleConfig.messages.handled.noUser,
                            err
                        );
                        res.redirect('/login');
                    }
                });
            }
        } else {
            res.redirect('/login');
        }
    });

    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/public/verification.html');
    });

    require('socketio-auth')(io, {
        authenticate: function (socket, data, callback) {
            let { email, jwt: token } = data;
            User.find({ email: email, jwt: token }, (err, found) => {
                if (err) {
                    errorHandler(
                        readUsersErrorMessage,
                        err
                    );
                    return callback(new Error("DB error"));
                } else if (found && found.length) {
                    logger(
                        consoleConfig.messages.success.usersReadMessage,
                        consoleConfig.colors.info
                    );
                    return callback(null, true);
                } else {
                    logger(
                        consoleConfig.messages.handled.noUser,
                        consoleConfig.colors.info
                    );
                    return callback(new Error("User not found"));
                }
            });
        }
    });

    // io.on('connection', (socket) => {
    //     socket.on('chat message', (msg) => {
    //         io.emit('chat message', msg);
    //     });
    // });

    http.listen(port, () => {
        console.log(`Listening on http://localhost${port}.`);
    });
})();
