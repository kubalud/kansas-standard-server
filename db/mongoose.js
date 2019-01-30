let mongoose = require('mongoose');
let errorHandler = require('./../services/error-handler');
let logger = require('./../services/logger');
const dbConfig = require('./../config/db');
const consoleConfig = require('./../config/console');

require('./models/user');

const { port, name } = dbConfig;

mongoose.set('useCreateIndex', true);

mongoose.connect(
    `mongodb://localhost:${port}/${name}`,
    { useNewUrlParser: true },
    (err) => {
        if (err) {
            errorHandler(consoleConfig.messages.errors.dbConnectionError, err);
        } else {
            logger(
                consoleConfig.messages.success.dbConnected,
                consoleConfig.colors.info
            );
        }
    }
);

module.exports = mongoose;