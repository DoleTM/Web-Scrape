var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schema constructor
var NoteSchema = new Schema({
    saved: {
        type: String,
        default: "true"
    },
    title: String,
    body: String
});

// Create model
var Note = mongoose.model("Note", NoteSchema);

// Export model
module.exports = Note;