var mongoose = require('mongoose');

var schema = mongoose.Schema;

var reviewSchema = new schema({
    orderId: {
        type: String
    },
    itemIds: {
        type: Array
    },
    username: {
        type: String
    },
    rev: {
        type: String
    },
    comment: {
        type: String
    },
    createdOn: {
        type: Date
    }
});



module.exports = mongoose.model('review',reviewSchema);