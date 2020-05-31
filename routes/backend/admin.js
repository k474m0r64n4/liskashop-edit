var express = require('express');
var router = express.Router();

var itemController = require('../../controller/itemcontroller');
var ordersController = require('../../controller/ordersController');
var userController = require('../../controller/userController');
var blogController = require('../../controller/blogController');

var admin = function (req, res, next) {
    if (req.isAuthenticated()) {
        var role = req.user.role;
        if(role === 'admin' || role === 'vendor'){
                next()
            } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/login')
    }
};

/* Item routes */
router.get('/',admin, itemController.item_list_get);
router.get('/create',admin, itemController.item_create_get);
router.post('/create',admin, itemController.item_create_post);
router.get('/update/:id',admin, itemController.item_update_get);
router.post('/update',admin, itemController.item_update_post);
router.post('/delete/:id',admin, itemController.item_delete_post);

/* Blog routes */
router.get('/blog/', admin, blogController.blog_list_get);
router.get('/blog/create', admin, blogController.blog_create_get);
router.get('/blog/:id', admin, blogController.blog_update_get);
router.post('/blog/create', admin, blogController.blog_create_post);
router.post('/blog/update/:id', admin, blogController.blog_update_post);
router.post('/blog/delete/:id', admin, blogController.blog_delete_post);

router.get('/comments', admin, blogController.comment_list_get);
router.post('/comments/update/:id', admin, blogController.comment_update);
router.post('/comments/delete/:id', admin, blogController.comment_delete_post);

/* User routes */
router.get('/userlist/', admin, userController.user_list);
router.get('/userlist/:id', admin, userController.user_detail_admin);
router.post('/user/delete/:id', admin, userController.user_delete_post);

/* Order Routes */
router.get('/orders/', admin, ordersController.order_list);
router.get('/orders/:id', admin, ordersController.order_detail);
router.post('/orders/update/:id', admin, ordersController.order_update_status);

module.exports = router;


