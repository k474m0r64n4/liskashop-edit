var Blog = require('../db/blogModel');


function blog_get (find,limit, skip, sort, callback) {
    return Blog.find(find).limit(limit).skip(skip).sort(sort).exec(callback);
}

function blog_post (query, callback) {
    return Blog.create(query).then(callback);
}

function blog_update_post(query, set, callback) {
    return Blog.update(query,set).then(callback);
}

function blog_delete_post(query, callback) {
    return Blog.remove(query).then(callback);
}

exports.blog_get = blog_get;
exports.blog_post = blog_post;
exports.blog_update_post = blog_update_post;
exports.blog_delete_post = blog_delete_post;
