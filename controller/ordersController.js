var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var Orders = require('../db/orderModel');
var User = require('../db/User');
var Review = require('../db/reviewModel');

// Display list of all Orders.
module.exports.order_list = function(req, res) {
    var user = req.user;
    Orders.find({ }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
                res.render('backend/orderlist', {

                    title: 'items List',
                    data: result,
                    user: user.username
                })
            }

})};

// Display detail page for a specific Order.
exports.order_detail = function(req, res) {
    var user = req.user;
    var o_id = new ObjectId(req.params.id);

    req.db.collection('orders').find({"_id": o_id}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            User.find({ "username": result[0].username }, function (err, userinfo) {
                res.render('backend/orderdetail', {
                    title: 'items List',
                    data: result,
                    data2: userinfo,
                    user: user
                })
            });
        }
    })};

// Display detail page for a specific Order.
exports.order_update_status = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var status = req.body.status;

    req.db.collection('orders').update({"_id": o_id},{ $set: { status: status}});
    res.redirect('/admin/orders');
};

// add to cart post
exports.addToCart = function(req, res) {
    var o_id = new ObjectId(req.body.itemid);
    var qty = req.body.qty;
    var user = req.user.username;
    var itm;

    req.db.collection('items').find({"_id": o_id}).toArray(function(err, item) {
        itm = item;
    });


        Orders.findOne({
            username: user,
            status: "open"
        }, function (err, doc) {
            if (err) {
                res.status(500).send('error occured')
            } else {
                if (doc) {
                    console.log(itm[0].name);
                    var totalprice = doc.orderprice + (itm[0].price * qty);
                    req.db.collection('orders').update({"username": user, status: "open"},
                        {   $set: { orderprice: totalprice },
                            $push: {
                            "items": {
                                itemid: itm[0]._id,
                                itemname: itm[0].name,
                                itemprice: itm[0].price,
                                itemamount: itm[0].amount,
                                qty: qty


                                } }
                        });
                    res.redirect('/cart');


                } else {

                    var rec = new Orders();
                    rec.username = user;

                    rec.items = [{
                        itemid: itm[0]._id,
                        itemname: itm[0].name,
                        itemprice: itm[0].price,
                        itemamount: itm[0].amount,
                        qty: qty
                    }];
                    rec.status = "open";
                    rec.orderprice = itm[0].price * qty;


                    rec.save(function (err, items) {
                        if (err) {
                            res.status(500).send('db error')
                        } else {
                            res.redirect('/cart');

                        }
                    })
                }
            }
        })

};

exports.review_get = function(req, res) {
    var user = req.user;
    var o_id = new ObjectId(req.params.id);
    Orders.find({"_id": o_id}, function (err, result) {


        res.render('review', {
            title: 'Review',
            data: result,
            items: "hello",
            user: user
        })
    } );
};

exports.review_post = function(req, res) {
    var today = new Date();
    var user = req.user;
    var o_id = new ObjectId(req.params.id);
    var itemIds = [];

    var rev = {
        rev: req.body.rev,
        comment:req.body.comment,
    };

    Orders.find({"_id": o_id}, function (err, result) {
        var xxx = result[0].items;
        xxx.forEach(function (x) {
            itemIds.push(x.itemid);

        });

        req.db.collection('orders').update({"_id": o_id},{ $set: { status: "reviewed"}});


    var record = new Review();
    record.orderId = o_id;
    record.itemIds = itemIds;
    record.username = user.username;
    record.rev = rev.rev;
    record.comment = rev.comment;
    record.createdOn = today;


    record.save(function (err, revs) {
        if (err) {
            res.status(500).send('db error')
        } else {
            res.redirect('/profile' )
        }
    });
    });

};

exports.conformOrder = function(req, res) {

    var user = req.user.username;

    req.db.collection('orders').update({"username": user, "status": "open"},{ $set: { status: "confirm"}});
    res.redirect('/profile');


};

// Change Order status
exports.order_update = function(req, res) {
    var user = req.user.username;
    var ord = {
        itemname: req.body.itemname,
        itemid: req.body.itemid,
        qty: req.body.qty
    };

    var q = ord.itemname;
    var num = 0;

    if(q[0].length === 1){
        req.db.collection('orders').update(
            {username: user, status:"open", "items.itemname": ord.itemname  },
            { $set : {
                    "items.$.qty" : ord.qty
                } },
            { upsert: true }
        );

    } else {
        q.forEach(function (o) {
            req.db.collection('orders').update(
                {username: user, status:"open", "items.itemname": o  },
                { $set : {
                        "items.$.qty" : ord.qty[num]
                    } },
                { multi: true, upsert: true }
            );
            num++;
        });

    }

    res.redirect('/cart');

};

// Handle Item delete on POST.
exports.order_item_delete = function(req, res) {
    var user = req.user.username;
    var o_id = new ObjectId(req.params.id);
    console.log(o_id);
    req.db.collection('orders').update({"username": user, "status": "open"}, { $pull: { items: { itemid: o_id } }});
    res.redirect('/cart');


};