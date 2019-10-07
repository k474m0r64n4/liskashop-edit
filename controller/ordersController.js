var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var Orders = require('../db/orderModel');

// Display list of all Orders.
module.exports.order_list = function(req, res) {
    var user = req.user;
    req.db.collection('orders').find().sort({"_id": -1}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            if (user.username === "boris") {
                req.db.collection('orders').find().toArray(function(err, orders) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(orders);
                        res.render('backend/orderlist', {
                            title: 'items List',
                            user: req.user,
                            data: result,
                            orders: orders
                        })
                    }
                });
            }else{

                res.render('cart', {

                    title: 'items List',
                    data: result,
                    user: user.username
                })
            }
        }
    })
};

// Display detail page for a specific Order.
exports.order_detail = function(req, res) {
    var user = req.user.username;
    var o_id = new ObjectId(req.params.id);

    req.db.collection('orders').find({"_id": o_id}).toArray(function(err, result) {
        if (err) {
            res.render('backend/userlist', {
                title: 'item List',
                data: ''
            })
        } else {
            if (user  === "boris") {
                console.log(result[0].username);
                req.db.collection('users').find({"username": result[0].username}).toArray(function(err, usr) {
                    res.render('backend/orderdetail', {
                        title: 'item List',
                        data: result,
                        data2: usr,
                        user: req.user
                    })
                })


            } else {

                res.render('profile', {
                    title: 'items List',
                    data: result
                })
            }
        }
    })};

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

exports.conformOrder = function(req, res) {

    var user = req.user.username;

    req.db.collection('orders').update({"username": user, "status": "open"},{ $set: { status: "conform"}});
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