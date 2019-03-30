// Dependencies
var express = require("express");
var expresshbrs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();
var databaseUrl = "scrapedb";
var collections = ["scraperbike"];

// Static dir
app.use(express.static("public"));
// Heroku and local port
var PORT = process.env.PORT || 3000;
// View Engine
app.engine("handlebars", expresshbrs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Database config with mongoose
mongoose.connect('mongodb://localhost/scrapedb', {useNewUrlParser: true});
// mongoose.connect('mongodb://heroku.mlab.com/heroku);
var db = mongoose.connection;
db.on("error", function(err) {
    console.log("Error:", err);
});
db.once("open", function() {
    console.log("Much Success");
});
// Models
var models = require("../models");
// Routes
// Index route
app.get("/", function(req, res) {
    res.render('index');
});

// GET all route from the database
app.get("/all", function(req, res) {
    db.scraperbike.find({}, function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

// GET route 
app.get("/scrape", function(req, res) {
    res.send("Scrapin on my scraper bike")
});

// POST route to save articles
app.post("/article", function(req, res) {
 res.json(article);
});

// POST route to add comments 
app.post("/comment", function(req, res) {
    res.json(comment);
});

// DELETE route
app.delete("/delete", function(req, res) {
    res.json(destroy);
});

app.listen(3000, function() {
    console.log("App running on port 3000!");
});