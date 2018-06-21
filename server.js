var express = require('express')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_s402mkr1:ik2glvetur52pbap6naul572dd@ds263670.mlab.com:63670/heroku_s402mkr1');


var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://cryptic-refuge-94653.herokuapp.com");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});




var session = require('express-session')
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'any string',
    cookie: { maxAge: 1800000 },
    rolling: true
}));


app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/hello', function (req, res) {
    res.send('Hello World2')
})

app.get('/message/:theMessage', function (req, res) {
  var theMessage = req.params['theMessage'];
  res.send(theMessage);
})

app.get('/api/session/set/:name/:value',
  setSession);
app.get('/api/session/get/:name',
  getSession);
// app.get('/api/session/get',
//   getSessionAll);
app.get('/api/session/reset', resetSession);

function setSession(req, res) {
  var name = req.params['name'];
  var value = req.params['value'];
  req.session[name] = value;
  res.send(req.session);
}

function getSession(req, res) {
  var name = req.params['name'];
  var value = req.session[name];
  res.send(value);
}
function resetSession(req, res) {
    req.session.destroy();
    res.send('session destroyed');
}




var userService = require('./services/user.service.server');
userService(app);

require('./services/section.service.server')(app);

app.listen(process.env.PORT || 4000);