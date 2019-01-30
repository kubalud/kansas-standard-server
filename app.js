let prompt = require('./services/prompt');

(async() => {
    await prompt();

    require('./db/mongoose');
    require('./db/passport');
    require('./middlewares/generic');
    require('./middlewares/routes');
})();
