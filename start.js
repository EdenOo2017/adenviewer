'use strict';

const express = require('express');
var app = require('./server/server');
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const path = require('path');
const flash = require('connect-flash');

server.listen(app.get('port'), function () {
  if (process.env.FORGE_CLIENT_ID !== null || process.env.FORGE_CLIENT_SECRET !== null)
    console.log('Server listening on port ' + server.address().port);
});


var clientio = require('socket.io-client');
var client = clientio('https://polar-mesa-97572.herokuapp.com');
io.sockets.on('connection', function (socket) {
  console.log('connected!')

  client.on('status1', function (STATUS1) {
    socket.emit('st1', STATUS1);
  });

  client.on('status2', function (STATUS2) {
    socket.emit('st2', STATUS2);
  });

  client.on('status3', function (STATUS3) {
    socket.emit('st3', STATUS3);
  });

  client.on('status4', function (STATUS4) {
    socket.emit('st4', STATUS4);
  });

  client.on('status5', function (STATUS5) {
    socket.emit('st5', STATUS5);
  });

  client.on('cow', function (cowData) {
    console.log(cowData + 'From Server');
  });

});

//#region Login and Registration

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:Utno1985!@ds125335.mlab.com:25335/eden', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

// Ejs Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Static folder
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//use sessions for tracking logins
app.use(session({
  secret: 'autodeskforge',
  // rolling: true,
  cookie: { maxAge: 1000 * 60 * 1 },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load routes
const users = require('./routes/users');
app.use('/', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


//#endregion


