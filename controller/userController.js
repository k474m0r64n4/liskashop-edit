var ObjectId = require('mongodb').ObjectId;

var User = require('../db/User');

// Display list of all Users.
exports.user_list = function(req, res) {
    User.find( { } ,function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('backend/userlist', {
                title: 'items List',
                data: result,
                user: req.user
            })
        }
    }).sort({"_id": -1})
};

// Display detail page for a specific User in cms.
exports.user_detail_admin = function(req, res) {
    var o_id = new ObjectId(req.params.id);

    User.find({ "_id": o_id }, function(err, result) {
        if (err) {
            res.redirect('backend/userlist')
        } else {
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
    User.find({"username": user}, function(err, result) {
        if (err) {
            console.log(err);
        } else  {
                req.db.collection('orders').find({username: user, $or: [ { status: "sent" }, { status: "confirm" }, { status: "reviewed" } ]  }).toArray(function(err, orders) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('profile', {
                            title: 'items List',
                            user: req.user,
                            data: result,
                            orders: orders
                        })
                    }
                });
            }
    })
};





// Handle Author delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.user_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var user = req.user;
    User.find({"username": user.username}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
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
    var img = { name: req.body.image} ;


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



    req.db.collection('users').update({"username": user.username}, { $set: data  });
    res.redirect('/profile');
};


