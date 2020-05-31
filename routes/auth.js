var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');

// Passport auth. POST
module.exports = function (passport) {
    router.post('/signup', userController.user_create_post);

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
    }), function (req, res) {
        res.send('hey')
    });
    return router;
};