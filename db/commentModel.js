var mongoose = require('mongoose');

var schema = mongoose.Schema;

var commentSchema = new schema({
    blogId:{
        type:String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    comText: {
        type: String
    },
    createdOn: {
        type: Date
    },
    status: {
        type: String
    }
});



module.exports = mongoose.model('comment',commentSchema);