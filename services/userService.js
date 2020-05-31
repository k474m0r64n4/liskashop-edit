var User = require('../db/User');


function user_get (find, callback) {
    return User.find(find).exec(callback);
}


function user_post (query, callback) {
    return User.create(query).then(callback);
}

function user_update_post(query, set, callback) {
    return User.update(query,set).then(callback);
}

function user_delete_post(query, callback) {
    return User.remove(query).then(callback);
}

exports.user_get = user_get;
exports.user_post = user_post;
exports.user_update_post = user_update_post;
exports.user_delete_post = user_delete_post;
