var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schema constructor
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    link: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    summary: {
        type: String,
        required: true
    },
    picture: String,
    author: String,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    dateAdded: {
        type: Date,
        default: Date.now()
    },
    saved: {
        type: String,
        default: "false"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export model
module.exports = Article;