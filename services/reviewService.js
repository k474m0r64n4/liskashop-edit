var Review = require('../db/reviewModel');

function review_get (find, callback) {
    return Review.find(find).exec(callback);
}

function review_post (query, callback) {
    return Review.create(query).then(callback);
}

function review_update_post(query, set, callback) {
    return Review.update(query,set).then(callback);
}

function review_delete_post(query, callback) {
    return Review.remove(query).then(callback);
}

exports.review_get = review_get;
exports.review_post = review_post;
exports.review_update_post = review_update_post;
exports.review_delete_post = review_delete_post;
