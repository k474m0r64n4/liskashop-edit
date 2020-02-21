var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');

router.use(fileUpload());

var itemController = require('../../controller/itemcontroller');
var ordersController = require('../../controller/ordersController');
var userController = require('../../controller/userController');
var blogController = require('../../controller/blogController');

var User = require('../../db/User');

var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("jeste ; " + req.user.username);
        next()
    } else {
        res.redirect('/login')
    }
};

var admin = function (req, res, next) {
    var user = req.user.username;
    if (req.isAuthenticated()) {
        User.find({"username": user}, function(err, result) {
            var role = result[0].role;
            if(role === 'admin'){
                next()
            }else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/login')
    }
};

/* Create, Read, Update, Delete Items, Upload Images */
router.get('/',admin, itemController.item_list_get);
router.get('/create',loggedin, itemController.item_create_get);
router.post('/create',loggedin, itemController.item_create_post);
router.get('/update/:id',loggedin, itemController.item_update_get);
router.post('/update',loggedin, itemController.item_update_post);
router.post('/delete/:id',loggedin, itemController.item_delete_post);
router.post('/upload', loggedin, itemController.item_upload_post);

/* Blog routes */
router.get('/blog/', loggedin, blogController.blog_list_get);
router.get('/blog/create', loggedin, blogController.blog_create_get);
//router.get('/blog/:id', loggedin, blogController.blog_update_get);
router.post('/blog/create', loggedin, blogController.blog_create_post);
router.post('/blog/update');
router.post('/blog/delete/:id');
router.post('/blog/upload', admin, blogController.blog_upload_post);

/* User routes */
router.get('/userlist/', userController.user_list);
router.get('/userlist/:id', userController.user_detail_admin);

/* Order Routes */
router.get('/orders/', ordersController.order_list);
router.get('/orders/:id', ordersController.order_detail);
router.post('/orders/add', ordersController.addToCart);

module.exports = router;


