// Dependencies
var express = require("express");
var expresshbrs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();
var db = require("./models");

// Use morgan for the app
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
// Static dir
app.use(express.static("public"));
// Heroku and local port
var PORT = process.env.PORT || 3000;
// View Engine
app.engine("handlebars", expresshbrs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Database config with mongoose
mongoose.connect("mongodb://localhost/scrapedb", { useNewUrlParser: true });
// mongoose.connect('mongodb://heroku.mlab.com/heroku);

// Routes
// Index route
app.get("/", function (req, res) {
    res.render('index');
});

// GET route for scraping the webpage
app.get("/scrape", function (req, res) {
    // Use axios to grab the body of the html page
    axios.get("https://www.nytimes.com/section/travel").then(function (response) {
        var $ = cheerio.load(response.data);
        //console.log(response.data);
        // Empty array to save the scrape
        var results = {};
        // "Scrape" everything within an h2 tag by using cheerio
        $(".css-ye6x8s").each(function (i, element) {
            console.log(i);
            // Save the results into an object that gets pushed into the empty results array
            results.title = $(element).find(".css-4jyr1y").find("h2").text();
            results.link = $(element).find(".css-4jyr1y").children("a").attr("href");
            results.summary = $(element).find(".css-4jyr1y").find("p").text();
            results.picture = $(element).find(".css-4jyr1y").find("img").attr("src");
            results.writer = $(element).find(".css-4jyr1y").find(".css-1n7hynb").text();
            // Create a new Article in the database from the results
            db.Article.create(results)
                .then(function (dbArticle) {
                    console.table(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        // Send a success message to the client so you know it worked
        console.log(results);
        res.send("Scrape successful")
    });
});

// GET route for getting all the articles from the database
app.get("/articles", function (req, res) {
    db.Article.find({}).sort({ link: -1 })
        .then(function (dbArticle) {
            // After finding the articles successfully send them to the client
            res.json(dbArticle);
            // If there is an error, catch it and send it to the client
        }).catch(function (err) {
            res.json(err);
        });
});

// GET route for grabbing specific articles and the notes associated with it
app.get("/articles/:id", function (req, res) {
    // Find the matching id parameter in the database
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        // After matching an article, send it to the client
        .then(function (dbArticle) {
            res.json(dbArticle);
            // If there is an error catch it and send it to the client
        }).catch(function (err) {
            res.json(err);
        });
});

// POST route to saving/updating notes associated with an article
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to an entry
    db.Note.create(req.body)
        // If a note was created find one article with an equal id to req.params.id
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote.id }, { new: true });
            // If the note was successfully updated to an article, send it to the client
        }).then(function (dbArticle) {
            res.json(dbArticle);
            // If it was unsuccessful updating to an article, catch the error and send it to the client
        }).catch(function (err) {
            res.json(err);
        });
});

// POST route to add comments 
// app.post("/comment", function (req, res) {
//     res.json(comment);
// });

// DELETE route for deleting notes by id
app.delete("/delete", function (req, res) {
    // Delete the note by finding it by id and then make sure it is taken away from the client
    db.Note.remove({ _id: req.body.id })
        .exec(function (err, doc) {
            res.send(doc);
            // If it was unsuccessful, catch the error and send it to the client
        }).catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on: " + "localhost:" + PORT);
});