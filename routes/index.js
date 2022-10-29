var express = require('express');
var router = express.Router();

var indexController = require('../controller/indexcontroller');
var blogController = require('../controller/blogController');
var itemController = require('../controller/itemcontroller');
var orderController = require('../controller/ordersController');
var userController = require('../controller/userController');

global.itmarr = [];

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
};

/* Index routes of all the links  */
router.get('/', indexController.getIndex);
router.get('/about', indexController.getAbout);
router.get('/contact', indexController.getContact);
router.get('/cart', orderController.getCartNew);
router.post('/addtocart', orderController.addToCartNew);
router.post('/updatecart', orderController.order_updateNew);
router.get('/del/:id', orderController.order_item_deleteNew);
router.post('/conform', orderController.conformOrder);
router.get('/checkout', orderController.getCheckout);
router.get('/login', indexController.getLogin);
router.get('/signup', indexController.getSignup);
router.get('/logout',loggedin, indexController.getLogout);

/* User names and routes of everything listed */
router.get('/profile/',loggedin, userController.user_detail);
router.get('/profile/:id',loggedin, userController.user_update_get);
router.post('/profile/edit',loggedin, userController.user_update_post);
router.get('/review/:id', loggedin, orderController.review_get);
router.post('/review/:id', loggedin, orderController.review_post);
router.get('/vendor/:name', itemController.vendor_detail);

/* Blog routes */
router.get('/blog/', blogController.blog_list);
router.get('/blog/:id', blogController.blog_detail);
router.post('/comment/post', blogController.comment_post);

/* Items routes*/
router.get('/items/', itemController.item_list);
router.get('/items/:id', itemController.item_detail);


module.exports = router;
