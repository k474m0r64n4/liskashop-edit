var mongoose = require('mongoose');

var schema = mongoose.Schema;

var blogSchema = new schema({
    title:{
        type:String
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
    authorID: {
        type: String
    },
    createdOn: {
        type: Date
    }
});

module.exports = mongoose.model('blog',blogSchema);