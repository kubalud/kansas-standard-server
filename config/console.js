const palette = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

const {
    cyan,
    red,
    green,
    yellow,
    magenta,
    reset: colorReset
} = palette;

module.exports = {
    colors: {
        info: `${cyan}%s${colorReset}`,
        error: `${red}%s${colorReset}`,
        success: `${green}%s${colorReset}`,
        magenta: `${magenta}%s${colorReset}`,
        warning: `${yellow}%s${colorReset}`
    },
    messages: {
        errors: {
            unknownSaveUserError: 'Could not save a user, unknown error type.',
            findUserFailed: 'DB error when searching for user.',
            prompt: 'Something went wrong while gathering user input.',
            dbConnection: 'Could not connect to DB.'
        },
        info: {
            serverListening: (port) => `Listening on http://localhost${port}.`,
            socketWithUserDisconnected: (socket) => `Socket ${socket.id} associated with user ${socket.client.user.email} has disconected.`,
            socketDisconnected: (socket) => `Socket with no user associated (probably due to server-side disconnect) ${socket.id} has disconected.`,
            dbConnected: 'Connected to DB. Awaiting queries.'
        },
        success: {
            userAutoConnected: (user) => `User ${user.email} has been verified automatically via jwt/email.`,
            userAuthenticated: (user) => `User ${user.email} has created an authenticated websocket connection.`,
            userAssociatedWithSocket: (socket) => `Socket ${socket.id} has been associated with user ${socket.client.user.email}.`,
            userCreatedAndLoggedIn: (user) => `User ${user.email} has just been created and logged in.`,
            userLoggedIn: (user) => `User ${user.email} has just logged in.`
        },
        failure: {
            jwtExpired: 'Expired JWT provided.',
            noSuchUser: 'No such user.',
            invalidPassword: 'Invalid password.',
            createDuplicateAttempt: 'Could not create a user due to a duplicate field value.'
        },
        warning: {
            noJWTIndexAccessAttempt: 'Attempted to access index with no JWT.'
        }
    },
    prompt: [{
        name: 'jwtSecret',
        message: 'Please provide a unique, secret passphrase to encode JSON Web Tokens.'
    }]
}