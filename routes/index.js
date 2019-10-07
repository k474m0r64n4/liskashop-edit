var express = require('express');
var router = express.Router();

var indexController = require('../controller/indexcontroller');
var orderController = require('../controller/ordersController');


var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
};

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

module.exports = router;