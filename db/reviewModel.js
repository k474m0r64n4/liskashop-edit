var mongoose = require('mongoose');

var schema = mongoose.Schema;

var reviewSchema = new schema({
    orderId: {
        type: String
    },
    itemId: {
        type: String
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