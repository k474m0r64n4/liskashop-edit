var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;

// var p = require('../models/author');

// Display list of all Users.
exports.user_list = function(req, res) {
    req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
        if (err) {
            res.render('backend/userlist', {
                title: 'item List',
                data: ''
            })
        } else {
            console.log(result);
            res.render('backend/userlist', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    })
};

// Display detail page for a specific User in cms.
exports.user_detail_admin = function(req, res) {
    var o_id = new ObjectId(req.params.id);

    req.db.collection('users').find({ "_id": o_id }).toArray(function(err, result) {
        if (err) {
            res.redirect('backend/userlist')
        } else {
            console.log(result);
            res.render('backend/userdetail', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    })
};


// Display detail page for a specific Author.
exports.user_detail = function(req, res) {
    var user = req.user.username;
    req.db.collection('users').find({"username": user}).toArray(function(err, result) {
        if (err) {
            console.log(err);

        } else {
            if (user  === "boris") {
                console.log(result);
                res.render('backend/userdetail', {
                    title: 'item List',
                    data: result,
                    user: req.user
                })
            } else {
                req.db.collection('orders').find({username: user, status: "conform"}).toArray(function(err, orders) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(orders);
                        res.render('profile', {
                            title: 'items List',
                            user: req.user,
                            data: result,
                            orders: orders
                        })
                    }
                });

            }



        }
    })};

// Display Author create form on GET.
exports.user_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.user_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.user_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var user = req.user;


    req.db.collection('users').find({"username": user.username}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.render('profileedit', {
                title: 'items List',
                user: req.user,
                data: result
            })
        }

    });


};

// Handle Author update on POST.
exports.user_update_post = function(req, res) {
    var user = req.user;

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city
    };


    req.db.collection('users').update({"username": user.username}, { $set: data  });
    res.redirect('/profile');
};