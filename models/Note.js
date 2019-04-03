var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schema constructor
var noteSchema = new Schema({
    title: String,
    body: String
});

// Create model
var Note = mongoose.model("Note", noteSchema);

// Export model
module.exports = Note;