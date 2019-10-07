var express = require('express');
var router = express.Router();

var itemController = require('../controller/itemcontroller');
var crud = require('../controller/crudController');


/* GET home page. */
router.get('/', itemController.item_list);
router.get('/:id', itemController.item_detail);
router.get('/page/:p', itemController.item_pages);
router.get('/category/:cat', itemController.item_category);
router.get('/tag/:tag', itemController.item_tag);


module.exports = router;