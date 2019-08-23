var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    saved: {
        type: String,
        default: "true"
    },
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;