var Comment = require('../db/commentModel');


function comment_get (find, callback) {
    return Comment.find(find).exec(callback);
}

function comment_post (query, callback) {
    return Comment.create(query).then(callback);
}

function comment_update_post(query, set, callback) {
    return Comment.update(query,set).then(callback);
}

function comment_delete_post(query, callback) {
    return Comment.remove(query).then(callback);
}

exports.comment_get = comment_get;
exports.comment_post = comment_post;
exports.comment_update_post = comment_update_post;
exports.comment_delete_post = comment_delete_post;
