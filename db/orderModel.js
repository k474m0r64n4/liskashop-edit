var mongoose = require('mongoose');

var schema = mongoose.Schema;

var orderSchema = new schema({
    user:{
        type: Object
    },
    items: {
        type: Array
    },
    status: {
        type: String
    },
    orderprice: {
        type: Number
    }
});



module.exports = mongoose.model('orders',orderSchema);