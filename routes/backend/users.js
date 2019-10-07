var express = require('express');
var router = express.Router();

var userController = require('../../controller/userController');


/* GET home page. */
router.get('/', userController.user_list);
router.get('/:id', userController.user_detail_admin);


module.exports = router;