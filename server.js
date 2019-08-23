// Dependencies   
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var app = express();
var PORT = process.env.PORT || 8080;

// Configure middleware
// Use morgan as alias logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public the static folder
app.use(express.static("public"));
// Setup Handlebars as the view engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cnetscrape";
mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true });

// Require Routes for scraping the articles
require("./routes/routes")(app);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port http://localhost:" + PORT);
});