var ObjectId = require('mongodb').ObjectId;
var userService = require('../services/userService');
var orderService = require('../services/orderService');

var User = require('../db/User');

// Display list of all Users GET
exports.user_list = function(req, res) {
    var find = {};
    userService.user_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('backend/userlist', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    });
};

// Display detail page for a specific User GET
exports.user_detail_admin = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    userService.user_get(find, function (err, result) {
        if (err) {
            res.redirect('backend/userlist')
        } else {
            res.render('backend/userdetail', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    });
};

// Display profile page for User GET
exports.user_detail = function(req, res) {
    var find = { username: req.user.username};
    userService.user_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else  {
            orderService.order_get({ "user.username" : req.user.username },function(err, orders) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('profile', {
                        title: 'Profil',
                        user: req.user,
                        data: result,
                        orders: orders
                    })
                }
            });
        }
    });

};

// User delete on POST.
exports.user_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    userService.user_delete_post(find, function (err, result) {
       res.redirect('/admin/userlist');
    });
};

// User create on POST
exports.user_create_post = function(req, res) {
    var today = new Date();
    var password = new User();
    password = password.hashPassword(req.body.password);
    var user = {
        username: req.body.username,
        password: password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city : req.body.city,
        role : 'customer',
        createdOn : today
    };
    var find = { "username": user.username };
    userService.user_get(find, function (err, result) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (result === []) {
                res.status(500).send('User already exists')
            } else {
                userService.user_post(user, function (err, ress) {
                    res.redirect('/login')
                })
            }
        }
    });
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
    var find = { username : req.user.username};
    userService.user_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('profileedit', {
                title: 'Profil',
                user: req.user,
                data: result
            })
        }
    });
};

// User update on POST.
exports.user_update_post = function(req, res) {
    var img = { name: req.body.image} ;
    var find = { username : req.user.username};

     if(req.files !== null){
         img = req.files.img;
         img.mv("public/images/users/" + img.name, function (err) {
             if (err)
                 return res.status(500).send(err);
         });
     }

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        bio: req.body.bio,
        image: img.name
    };

     userService.user_update_post(find, data, function (err, result) {
        res.redirect('/profile');
     });

};


