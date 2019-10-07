var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');


router.use(fileUpload());


var adminController = require('../../controller/admincontroller');
var itemController = require('../../controller/itemcontroller');

var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
};

/* GET home page. */

router.get('/',loggedin, itemController.item_list_get);
//router.get('/itemlist',loggedin, itemController.item_list_get);
router.get('/create',loggedin, itemController.item_create_get);
router.post('/create',loggedin, itemController.item_create_post);
//router.get('/update',loggedin, itemController.item_update_get);
router.post('/update',loggedin, itemController.item_update_post);
router.get('/update/:id',loggedin, itemController.item_update_get);
router.post('/delete/:id',loggedin, itemController.item_delete_post);

router.post('/upload', loggedin, itemController.item_upload_post);

// router.post('/upload', upload.single('image'), itemController.upload);

router.get('/orders');
router.get('/orders/:id');

module.exports = router;


