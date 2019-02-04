const palette = {
    'black': '\x1b[30m',
    'red': '\x1b[31m',
    'green': '\x1b[32m',
    'yellow': '\x1b[33m',
    'blue': '\x1b[34m',
    'magenta': '\x1b[35m',
    'cyan': '\x1b[36m',
    'white': '\x1b[37m',
    'reset': '\x1b[0m'
};

const {
    cyan,
    red,
    green,
    reset: colorReset
} = palette;

module.exports = {
    'colors': {
        'info': `${cyan}%s${colorReset}`,
        'error': `${red}%s${colorReset}`,
        'success': `${green}%s${colorReset}`
    },
    'messages': {
        'errors': {
            'login': {
                'userNotFound': 'User not found',
                'invalidPassword': 'Invalid password'
            },
            'crud': {
                'createDuplicateAttempt': 'Could not create a user due to a duplicate field value',
                'createFailed': 'Could not create a user',
                'findUserFailed': 'DB error when searching for user'
            },
            'prompt': 'Something went wrong while gathering user input',
            'dbConnection': 'Could not connect to DB',
            'dbUnknown': 'DB error'
        },
        'handled': {
            'noUser': 'No such user'
        },
        'success': {
            'dbConnected': 'Connected to DB. Awaiting queries.',
            'usersReadMessage': 'User found'
        }
    },
    'prompt': [{
        'name': 'jwtSecret',
        'message': 'Please provide a unique, secret passphrase to encode JSON Web Tokens'
    }]
}