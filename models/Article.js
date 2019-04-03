var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schema constructor
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});
// Create model
var Article = mongoose.model("Article", ArticleSchema);

// Export model
module.exports = Article;