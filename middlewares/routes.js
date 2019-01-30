let app = require('./generic');
let http = require('http').Server(app);
let io = require('socket.io')(http);
let authentication = require('./../services/authentication');
const routeConfig = require('./../config/routes');

let port = process.env.PORT || 3000;

const {
    loginUser: loginUserRoute,
    registerUser: registerUserRoute
} = routeConfig;

app.post(loginUserRoute, (req, res) => {
    authentication.login(req, res);
});

app.post(registerUserRoute, (req, res) => {
    authentication.register(req, res);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log(`Listening on http://localhost${port}.`);
});