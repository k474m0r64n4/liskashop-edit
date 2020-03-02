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
            if(role === 'admin' || role === 'vendor'){
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
router.get('/blog/:id', loggedin, blogController.blog_update_get);
router.post('/blog/create', loggedin, blogController.blog_create_post);
router.post('/blog/update', admin, blogController.blog_update_post);
router.post('/blog/delete/:id', admin, blogController.blog_delete_post);
router.post('/blog/upload', admin, blogController.blog_upload_post);

router.get('/comments', admin, blogController.comment_list_get);
router.post('/comments/update/:id', admin, blogController.comment_update);

/* User routes */
router.get('/userlist/', admin, userController.user_list);
router.get('/userlist/:id', admin, userController.user_detail_admin);

/* Order Routes */
router.get('/orders/', admin, ordersController.order_list);
router.get('/orders/:id', admin, ordersController.order_detail);
router.post('/orders/update/:id', admin, ordersController.order_update_status);
//router.post('/orders/add', ordersController.addToCart);

module.exports = router;


