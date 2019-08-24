// Dependencies
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        trim: true,
        required: true
    },
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
    },
    photo: String,
    author: String,
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;