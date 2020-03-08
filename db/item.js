var mongoose = require('mongoose');

var schema = mongoose.Schema;

var itemSchema = new schema({
    name:{
        type:String
    },
    price: {
        type: Number
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
    vendor: {
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
    },
    createdOn: {
        type: Date
    }
});

module.exports = mongoose.model('item',itemSchema);