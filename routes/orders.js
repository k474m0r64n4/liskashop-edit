var express = require('express');
var router = express.Router();
// ne treba ova
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('cart', {
        title: 'Liska'
    });
});

module.exports = router;