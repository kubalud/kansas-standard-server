let prompt = require('./services/prompt');

(async() => {
    await prompt();

    let express = require('express');
    let app = module.exports = express();
    let http = require('http').Server(app);
    let io = require('socket.io')(http);
    let authentication = require('./services/authentication');

    let port = process.env.PORT || 3000;

    // Generic middleware
    app.use(express.static(require('path').join(__dirname, 'public')));
    require('./db/passport');
    app.use(require('body-parser').json());
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200");
        res.setHeader('Access-Control-Allow-Method', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
        next();
    });

    // Route middleware
    // app.post(loginUserRoute, (req, res) => {
    //     authentication.login(req, res);
    // });

    // app.post(registerUserRoute, (req, res) => {
    //     authentication.register(req, res);
    // });

    app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    });

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/public/register.html');
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });

    require('socketio-auth')(io, {
        authenticate: function (socket, data, callback) {
            require('./db/models/user').find(
                {
                    email: data.email,
                    password: data.password
                },
                (err, data) => {
                    if (err) {
                        // errorHandler(
                        //     readUsersErrorMessage,
                        //     err,
                        //     res.send.bind(res)
                        // );
                        return callback(new Error("User not found"));
                    } else {
                        console.log(data);
                        // logger(
                        //     infoColor,
                        //     usersReadMessage,
                        //     res.send.bind(res)
                        // );
                        return callback(null, true);
                    }
                }
            );
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
