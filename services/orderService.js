var Order = require('../db/orderModel');


function order_get (find, callback) {
    return Order.find(find).exec(callback);
}

function order_post (query, callback) {
    return Order.create(query).then(callback);
}

function order_update_post(query, set, callback) {
    return Order.update(query,set).then(callback);
}

function order_delete_post(query, callback) {
    return Order.remove(query).then(callback);
}

exports.order_get = order_get;
exports.order_post = order_post;
exports.order_update_post = order_update_post;
exports.order_delete_post = order_delete_post;
