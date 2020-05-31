var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
var blogService = require('../services/blogService');
var commentService = require('../services/commentService');

// Front
// Display list of all Blogs GET
module.exports.blog_list = function(req, res) {
    var query = req.query;
    var current = 1;
    var count = 0;
    var user = req.user;
    var limit = 6;
    var pages = 1;
    var find = {};
    var sort = {"_id": -1};

    // Page Query
    if(query.page){
        current = query.page;
    }
    var skip = limit * (current-1);

    // Count Blogs
    blogService.blog_get(find, 0, 0, {}, function (err, result) {
        count = result.length;
        pages = parseInt((count / limit) + 0.9);
    });

    // Find Blogs
    blogService.blog_get(find,limit, skip, sort, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.render('bloglist', {
                title: 'Blog',
                data: result,
                user: user,
                moment: moment,
                current: current,
                pages: pages,
            })
        }
    });

};

// Display detail Blog page GET
module.exports.blog_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id : o_id };
    var findComm = { blogId: o_id, status: 'approuve' };

    // Find Blog
    blogService.blog_get(find, 0,0,{}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            commentService.comment_get(findComm, function (err, comments) {
                res.render('blogsingle', {
                    title: 'Blog',
                    user: req.user,
                    moment: moment,
                    data: result,
                    coms: comments
                })
            });
        }
    });
};

// Admin Panel
// Blog list GET
module.exports.blog_list_get = function(req, res) {
    blogService.blog_get({},0,0,{}, function (err, result) {
        res.render('backend/bloglist', {
            title: 'Blog list admin',
            data: result,
            moment: moment,
            user: req.user
        })
    });
};

// Blog create GET
module.exports.blog_create_get = function(req, res) {
    res.render('backend/createblog', {
        title: 'Add New Blog',
        user: req.user.username
    })
};

// Blog create POST
exports.blog_create_post = function(req, res) {
    var today = new Date();
    var img = req.files.img;

    var blog = {
        title: req.body.title,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        authorID: req.user.username,
        createdOn: today
    };
    var find = { name: req.body.name };
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };

    blogService.blog_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (result === []) {
                res.status(500).send('Blog already exists')
            } else {
                img.mv("public/images/blog/" + img.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
                blogService.blog_post(blog, function (err, ress) {
                    res.redirect('/admin')
                })
            }
        }
    });
};

// Blog updte GET
exports.blog_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    blogService.blog_get({ _id: o_id  }, 0,0,{}, function (err, result) {
        res.render('backend/updateblog', {
            title: 'Update blog',
            data: result,
            user: req.user
        })
    });
};

// Blog update POST
exports.blog_update_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var img = { name: req.body.image} ;
    var find = { _id: o_id};

    if(req.files !== null){
        img = req.files.img;
        img.mv("public/images/blog/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }

    var blog = {
        title: req.body.title,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
    };

    blogService.blog_update_post(find, blog, function (err, result) {
        res.redirect('/admin/blog');
    });

};

// Blog delete POST.
exports.blog_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id};

    blogService.blog_delete_post(find, function (err, result) {
        res.redirect('/admin/blog')
    });
};

// Comment list GET
exports.comment_list_get = function(req, res) {
    commentService.comment_get({}, function (err, result) {
        res.render('backend/commentlist', {
            title: 'Comment list',
            data: result,
            user: req.user
        })
    });
};

// Comment update POST
exports.comment_update = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var status = req.body.status;
    var find = { _id:o_id};
    var set = { status: status};
    commentService.comment_update_post(find, set, function (err, result) {
        res.redirect('/admin/comments');

    });
};

// Comment delete POST
exports.comment_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id:o_id};
    commentService.comment_delete_post(find, function (err, result) {
        res.redirect('/admin/comments');

    });
};

// Comment create POST
exports.comment_post = function(req, res) {
    var today = new Date();
    var com = {
        blogId: req.body.bid,
        username: req.body.name,
        email: req.body.email,
        comText:req.body.comText,
        status: 'on moderation',
        createdOn: today
    };

    commentService.comment_post(com, function (err, result) {
        res.redirect('/blog/' + com.blogId)
    });
};
