var moment = require('moment');
var itemService = require('../services/itemService');
var blogService = require('../services/blogService');

// Index page GET
exports.getIndex = function(req, res) {
    itemService.item_get({},6,0,{ _id: -1 } ,function(err, result) {
        if (err) {
            console.log(err);
        } else {
            blogService.blog_get({},2,0,{ _id: -1 }, function (err, blog) {
                res.render('index', {
                    title: 'Liskina Bašta',
                    data: result,
                    data2: blog,
                    moment: moment,
                    user: req.user
                })
            });
        }
    })
};

// About page GET
exports.getAbout = function (req, res) {
  res.render('about', {
      title: 'O nama',
      user: req.user
  });
};

// Contact page GET
exports.getContact = function(req, res) {
    res.render('contact', {
        title: 'Kontakt',
        user: req.user
    });
};

// Login GET
exports.getLogin = function(req, res) {
    res.render('login',{
        user: req.user
    });
};

// Signuo GET
exports.getSignup = function(req, res) {
    res.render('signup',{
        user: req.user
    });
};

// Logout GET
exports.getLogout = function(req, res) {
    req.logout();
    res.redirect('/');
};

