var express = require('express');
var router = express.Router();


module.exports.getIndex = function(req, res) {
    req.db.collection('items').find().sort({"_id": -1}).toArray(function(err, result) {
        if (err) {
            res.render('index', {
                title: 'item List',
                data: ''
            })
        } else {
            res.render('index', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    })
};

module.exports.getAbout = function (req, res) {
  res.render('about', {
      title: 'about',
      user: req.user
  });
};

module.exports.getContact = function(req, res) {
    res.render('contact', {
        title: 'Express',
        user: req.user
    });
};

module.exports.getCart = function(req, res) {
    var user = req.user;
    req.db.collection('orders').find({username: user.username, status: "open"}).toArray(function(err, result) {
        var r;
        var b;
        var q;

        var totalprice = 0;


        result.forEach(function (g) {
            r = g.items ;
        });

        if(r !== undefined){
        r.forEach(function (m) {
            b = parseInt(m.itemprice);
            q = parseInt(m.qty);
            totalprice = totalprice + (b * q);

        });

        req.db.collection('orders').update({"username": user.username, status: "open"},
            {   $set: { orderprice: totalprice }  });

        }

        res.render('cart', {

            title: 'items List',
            data:result,
            total: totalprice,
            user: req.user,
            itm: r
        })
    })
};

module.exports.getCheckout = function(req, res) {
    var user = req.user;
    req.db.collection('orders').find({username: user.username, status: "open"}).toArray(function(err, result) {
        var r;
        var b;
        var q;

        var totalprice = 0;

        result.forEach(function (g) {
            r = g.items ;
        });

        if(r !== undefined){
            r.forEach(function (m) {
                b = parseInt(m.itemprice);
                q = parseInt(m.qty);
                totalprice = totalprice + (b * q);

            });

        }

        res.render('checkout', {
            title: 'items List',
            data:result,
            total: totalprice,
            user: req.user,
            itm: r
        })
    })
};

module.exports.getLogin = function(req, res) {
    res.render('login',{
        user: req.user
    });

};

module.exports.getSignup = function(req, res) {
    res.render('signup',{
        user: req.user
    });

};

module.exports.getLogout = function(req, res) {
    req.logout();
    res.redirect('/');
};

