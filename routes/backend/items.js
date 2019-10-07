var express = require('express');
var router = express.Router();

var itemController = require('../../controller/itemcontroller');

/* GET home page. */
router.get('/', itemController.item_list);
router.get('/:id', itemController.item_delete_get);


module.exports = router;