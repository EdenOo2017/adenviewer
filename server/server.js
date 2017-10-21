'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

app.use(cookieParser());
app.set('trust proxy', 1)
app.use(session({
    secret: 'autodeskforge',
    cookie: {
        httpOnly: true,
        secure: (process.env.NODE_ENV === 'production'),
        maxAge: 1000 * 60 * 60
    },
    resave: false,
    saveUninitialized: true
}));

app.use('/', express.static(__dirname + '/../www'));
app.use('/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/../node_modules/moment/min'));
app.use('/js', express.static(__dirname + '/../node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/../node_modules/font-awesome/css'))
app.use('/fonts', express.static(__dirname + '/../node_modules/bootstrap/dist/fonts'));
app.set('port', process.env.PORT || 3000);

var oauth = require('./oauth');
app.use('/', oauth);

module.exports = app;