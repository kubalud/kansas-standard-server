let bodyParser = require('body-parser');
let passport = require('passport');
let app = module.exports = require('express')();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use((req, res, next) => {    
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200");
    res.setHeader('Access-Control-Allow-Method', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});