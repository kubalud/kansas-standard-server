let prompt = require('./services/prompt');

(async() => {
    await prompt();

    let express = require('express');
    let bodyParser = require('body-parser');
    let app = module.exports = express();
    let http = require('http').Server(app);
    let io = require('socket.io')(http);
    let authentication = require('./services/authentication');
    let User = require('./db/setup').model('User');

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

    let authenticated = (req) => {
        return false;
    };

    app.get('/', (req, res) => {
        if (authenticated(req)) {
            res.sendFile(__dirname + '/public/app.html');
        } else {
            res.redirect('/login');
        }
    });

    app.get('*', (req, res) => {
        res.redirect('/');
    });

    require('socketio-auth')(io, {
        authenticate: function (socket, data, callback) {
            User.find(
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
