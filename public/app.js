var express = require('express');
var app = module.exports = express();
var itemDb = require('./itemDB');
var UserDB = require('./UserDB');
var User = require('./model/User.js');
var UserProfile = require('./model/UserProfile.js');
app.use('/assets',express.static('assets'));
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
  secret:"this is a secret",
  resave: false,
  saveUninitialized: true
}));


var controller = require('./routes/Controller.js');
var ProfileController  = require('./routes/ProfileController.js');

app.use('/myitems',ProfileController);

app.use('/',controller);

app.listen(8080);
