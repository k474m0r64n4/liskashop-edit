var express = require('express');
var router = express.Router();


var indexController = require('../controller/indexcontroller');
var blogController = require('../controller/blogController');
var itemController = require('../controller/itemcontroller');
var orderController = require('../controller/ordersController');
var userController = require('../controller/userController');


var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
};

/* Index routes  */
router.get('/', indexController.getIndex);
router.get('/about', indexController.getAbout);
router.get('/contact', indexController.getContact);
router.get('/cart',loggedin, indexController.getCart);
router.post('/addtocart',loggedin, orderController.addToCart);
router.post('/updatecart', orderController.order_update);
router.get('/del/:id',loggedin, orderController.order_item_delete);
router.get('/conform',loggedin, orderController.conformOrder);
router.get('/checkout',loggedin, indexController.getCheckout);
router.get('/login', indexController.getLogin);
router.get('/signup', indexController.getSignup);
router.get('/logout',loggedin, indexController.getLogout);

/* User routes */
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

/* Routes for Items */
router.get('/items/', itemController.item_list);
router.get('/items/:id', itemController.item_detail);
//router.get('/items/page/:p', itemController.item_pages);
router.get('/items/category/:cat', itemController.item_list);
router.get('/items/tag/:tag', itemController.item_list);

module.exports = router;