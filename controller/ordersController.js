var ObjectId = require('mongodb').ObjectId;
var orderService = require('../services/orderService');
var itemService = require('../services/itemService');
var userService = require('../services/userService');
var reviewService = require('../services/reviewService');

// var Review = require('../db/reviewModel');

// Display list of all Orders GET
exports.order_list = function(req, res) {
    orderService.order_get({ }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
                res.render('backend/orderlist', {
                    title: 'items List',
                    data: result,
                    user: req.user
                })
            }
    })
};

// Display detail page for a specific Order. GET
exports.order_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id : o_id };
    orderService.order_get(find, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('backend/orderdetail', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    })
};

// Change status for Order POST
exports.order_update_status = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var status = req.body.status;
    var find = { _id : o_id };
    var set = { status : status };
    orderService.order_update_post(find, set, function (err, result) {
        res.redirect('/admin/orders');
    });
};

// Display details for Cart page GET
exports.getCartNew = function(req, res) {
    var total = 0;
    var br = 0;
    itmarr.forEach(function (i){
        total += i.price * i.qty;
    });
    res.render('cart', {
        title: 'Korpa',
        data:itmarr,
        br:br,
        total: total,
        user: req.user
    })
};

// Add to cart GET
exports.addToCartNew = function(req, res) {
    var o_id = new ObjectId(req.body.itemid);
    var qty = req.body.qty;
    var itm = {};
    var find = { _id : o_id };
    itemService.item_get(find,0,0,{}, function (err, result) {
        itm.id = o_id;
        itm.name = result[0].name;
        itm.price = result[0].price;
        itm.amount = result[0].amount;
        itm.qty = qty;
        itm.img = result[0].image;
        itmarr.push(itm);

        res.redirect('/items/' + o_id);
    });
};

// Update items from Cart GET
exports.order_updateNew = function(req, res) {
    var br = [];
    var stagod = [];
    var m = {};
    var q = req.body.qty;

    if(itmarr.length === 1){

        m = {
            id: itmarr[0].id,
            name: itmarr[0].name,
            price: itmarr[0].price,
            amount: itmarr[0].amount,
            img: itmarr[0].img,
            qty: q
        };
        stagod.push(m);

    } else {
        for( var i = 0; i< itmarr.length; i++){
            m = {
                id: itmarr[i].id,
                name: itmarr[i].name,
                price: itmarr[i].price,
                amount: itmarr[i].amount,
                img: itmarr[i].img,
                qty: q[i]
            };
            stagod.push(m);

        }
    }

    itmarr = stagod;

    res.redirect('/cart');

};

// Handle Item delete from Cart POST.
exports.order_item_deleteNew = function(req, res) {
    var id = req.params.id;
    var value = itmarr[id];

    itmarr = itmarr.filter(function(item) {
        return item !== value
    });
    res.redirect('/cart');
};

// Display checkout page GET
exports.getCheckout = function(req, res) {
    var total = 0;
    var find = { '' : 'null'};
    var userdata = [{
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        city: ''
    }];

    itmarr.forEach(function (i){
        total += i.price * i.qty;
    });

    if(req.user){
        find = { "username": req.user.username }
    }

    userService.user_get(find, function (err, result) {
        if(result.length > 0){
          userdata = result;
        }
        res.render('checkout', {
            title: 'Plaćanje',
            data:itmarr,
            total: total,
            userdata: userdata,
            user: req.user
        })
    });
};

// Confirm order POST
exports.conformOrder = function(req, res) {
    var today = new Date();
    var total = 0;
    var username = "new customer";

    if(req.user){
        username = req.user.username;
    }
    itmarr.forEach(function (i){
        total += i.price * i.qty;
    });

    var usr = {
        username: username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city
    };

    var order = {
        user: usr,
        items: itmarr,
        status: 'confirm',
        orderprice: total,
        createdOn: today
    };

    orderService.order_post(order, function (err, result) {
        itmarr = [];
        res.redirect('/')
    });
};

// Display Review page GET
exports.review_get = function(req, res) {
    var user = req.user;
    var o_id = new ObjectId(req.params.id);
    orderService.order_get({"_id": o_id}, function (err, result) {
        res.render('review', {
            title: 'Ocenjivanje',
            data: result,
            user: user
        })
    });
};

// Review POST
exports.review_post = function(req, res) {
    var today = new Date();
    var o_id = new ObjectId(req.params.id);
    var data = [];
    var review = {};

    var ids = req.body.itemId;
    var revs = req.body.rev;
    var com = req.body.comment;

    if (!Array.isArray(ids)){
        ids = [req.body.itemId];
        revs = [req.body.rev];
        com = [req.body.comment];
    }

    for(var i=0; i<ids.length; i++){
        review = { itemId: ids[i], rev: revs[i] ,comment: com[i],username: req.user.username, createdOn: today };
        data.push(review);
    }

    var find = { _id: o_id};
    var set = { status : "reviewed" };
    orderService.order_update_post(find, set, function (err, result) {});

     reviewService.review_post(data, function (err, result) {
         res.redirect('/profile' )
     });
};

