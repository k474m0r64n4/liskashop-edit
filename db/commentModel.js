var mongoose = require('mongoose');

var schema = mongoose.Schema;
// Srediti
var commentSchema = new schema({
    blogId:{
        type:String
    },
    userId: {
        type: String
    },
    comText: {
        type: String
    },
    status: {
        type: String
    }
});



module.exports = mongoose.model('comment',commentSchema);