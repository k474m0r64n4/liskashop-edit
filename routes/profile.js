var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');

var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
};

/* GET home page. */
router.get('/',loggedin, userController.user_detail);
router.get('/:id',loggedin, userController.user_update_get);
router.post('/edit',loggedin, userController.user_update_post);


module.exports = router;