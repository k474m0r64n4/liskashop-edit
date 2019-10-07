var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema;

var itemSchema = new schema({
    name:{
        type:String
    },
    price: {
        type: String
    },
    amount: {
        type: String
    },
    description: {
        type: String
    },
    content_text: {
        type: String
    },
    image: {
        type: String
    },
    gallery: {
        type: Array
    },
    category: {
        type: String
    },
    tags: {
        type: Array
    },
    origin: {
        type: String
    },
    status: {
        type: String
    }
});



module.exports = mongoose.model('item',itemSchema);