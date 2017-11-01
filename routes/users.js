const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const route = express.Router();
var User = require('../models/user');
const path = require('path');

function calcTime() {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * 8));
    var updateDate = nd.toLocaleDateString() + "T" + (nd.toLocaleTimeString());
    return updateDate;
}

// User Login Route
route.get('/', function (req, res) {
    res.render('login');
});

// User Register Route
route.get('/register', function (req, res) {
    res.render('register');
});

// Register Form POST
route.post('/register/data', function (req, res) {

    User.findOne({ email: req.body.user_useremail })
        .then(user => {
            if (user) {
                req.flash('error', 'Email already registered!');
                res.locals.message_error = req.flash();
                res.locals.user_username = req.body.user_username;
                res.locals.user_useremail = req.body.user_useremail;
                return res.render('register');
            } else {
                var createDate = calcTime();

                var newUser = {
                    username: req.body.user_username,
                    email: req.body.user_useremail,
                    password: req.body.user_password,
                    date: createDate,
                    approval: 0
                };

                User.create(newUser, function (error, user) {
                    if (error) {
                        req.flash('error', 'User name already registered!');
                        res.locals.message_error = req.flash();
                        res.locals.user_username = req.body.user_username;
                        res.locals.user_useremail = req.body.user_useremail;
                        return res.render('register');
                    } else {
                        req.flash('success', 'Registration successfully');
                        res.locals.message_success = req.flash();
                        return res.render('login');
                    }
                });
            }
        });
})

route.post('/login/data', function (req, res) {
    if (req.body.user_username && req.body.user_password) {

        User.find({ username: req.body.user_username }, function (err, doc) {
            if (doc.length === 0) {
                req.flash('error', 'User name not found!');
                res.locals.message_error = req.flash();
                return res.render('login');
            }

            var approval = (doc[0].approval);          

            if (approval == 0) {
                req.flash('error', 'User has not approved yet!');
                res.locals.message_error = req.flash();
                return res.render('login');
            }

            else {
                User.authenticate(req.body.user_username, req.body.user_password, function (error, user) {
                    if (error || !user) {
                        req.flash('error', 'Wrong user name or password!');
                        res.locals.message_error = req.flash();
                        return res.render('login');

                    } else {
                        req.session.userId = user._id;
                        req.session.userId = user._id;
                        req.session.userId = user._id;
                        return res.redirect('/viewer');
                    }
                });
            }
        })
    }
})

// GET route after registering
route.get('/viewer', function (req, res) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    req.flash('error', 'Login again!');
                    res.locals.message_error = req.flash();                  
                    return res.redirect('/')
                } else {
                    return res.sendFile(path.join(__dirname + '/../www/index.html'));
                }
            }
        });
});

// GET for logout logout
route.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                console.log("logout")
                return res.redirect('/');
            }
        });
    }
});

module.exports = route;
