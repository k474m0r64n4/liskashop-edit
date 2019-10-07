var express = require('express');
var router = express.Router();

var ordersController = require('../../controller/ordersController');

/* Order Routes */
router.get('/', ordersController.order_list);
router.get('/:id', ordersController.order_detail);
router.post('/add', ordersController.addToCart);


module.exports = router;