var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var Blog = require('../db/blogModel');

// Display list of all Blog.
module.exports.blog_list = function(req, res) {
    var user = req.user;
    var count = 0;
    var current = 1;
    var limit = 6;
    var pages = parseInt((count / limit) + 0.9);

    Blog.find( {}, function(err, result) {
        if (err) {
            res.render('backend/blog', {
                title: 'Blog List',
                data: ''
            })
        } else {
            res.render('bloglist', {
                title: 'Blog List',
                data: result,
                user: user,
                current: current,
                pages: pages,
            })
        }
    }).limit(limit).sort({"_id": -1})

};

// Display detail page for a specific Blog.
module.exports.blog_detail = function(req, res) {
    var user = req.user;
    var o_id = new ObjectId(req.params.id);
    Blog.find({"_id": o_id}, function(err, result) {
        if (err) {
            res.render('backend/updateitem', {
                title: 'item List',
                data: ''
            })
        } else {
            res.render('blogsingle', {
                title: 'items List',
                user: user,
                data: result
            })
        }
    })

};

// Display detail page for a specific Blog.
module.exports.blog_list_get = function(req, res) {
    var user = req.user.username;
    Blog.find( {}, function(err, result) {
        res.render('backend/bloglist', {
            title: 'Blog list admin',
            data: result,
            user: req.user
        })
    });

};

// Display detail page for a specific Blog.
module.exports.blog_create_get = function(req, res) {
    res.render('backend/createblog', {
        title: 'Add New Blog',
        user: req.user.username,
        name: '',
        price: '',
        description: '',
        image: '',
        gallery:'',
        category:''
    })

};

// Handle Item create on POST. back
exports.blog_create_post = function(req, res) {

    var img = req.files.img;
    var blog = {
        title: req.body.title,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        authorID: req.body.authorid

    };

    Blog.findOne({
        title: blog.title
    }, function (err, doc) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (doc) {
                res.status(500).send('Blog already exists')
            } else {
                img.mv("public/images/slike/blog/" + img.name, function (err) {
                    if (err)
                        return res.status(500).send(err);


                });


                var record = new Blog();
                record.title = blog.title;
                record.description = blog.description;
                record.content_text = blog.content_text;
                record.image = blog.image;
                record.authorID = blog.authorID;


                record.save(function (err, items) {
                    if (err) {
                        res.status(500).send('db error')
                    } else {
                        res.redirect('/admin')
                    }
                })

            }
        }
    })
};


// Display Item update form on GET. back
exports.blog_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    Blog.find({ "_id": o_id  }).toArray(function(err, result) {
        res.render('backend/updateblog', {
            title: 'Update Blog',
            data: result,
            user: req.user
        })
    });
};

// Handle Item update on POST. back
exports.blog_upload_post = function(req, res) {
    var img = req.files.img;
    console.log("jooj ;" + img);
    img.mv("public/images/slike/blog/" + img.name, function (err) {
        if (err)
            return res.status(500).send(err);


    });



};