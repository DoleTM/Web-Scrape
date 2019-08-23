// Dependencies
var axios = require('axios');
var cheerio = require('cheerio');
var db = require('../models');

// Routes
module.exports = function (app) {
    // Index route
    app.get("/", function (req, res) {
        db.Article.find({}).sort({ _id: -1 }).then(function (data) {
            res.render('index', {
                content: data
            });
        }).catch(function (error) {
            res.render('404');
        });
    });

    // GET route for scraping the webpage
    app.get("/scrape", function (req, res) {
        // Use axios to grab the body of the html page
        axios.get("https://medium.com/topic/technology").then(function (response) {
            console.log(response);
            var $ = cheerio.load(response.data);
            // Empty array to save the scrape

            // .css-ye6x8s is the elements class needed to grab the article
            $(".hx, .hy, .w, .ap, .hz, .ia, .ib, .ic, .id, .as").each(function (i, element) {
                console.log(i);
                // Save the results into an object that gets pushed into the empty results array
                var result = {};
                result.title = $(this).find("h3").children("a").text();
                result.link = 'https://medium.com/' + $(this).find("h3").children("a").attr("href");
                result.summary = $(this).find("p").children("a").text();
                result.picture = $(this).find(".l gb gc ii ij ik il").attr("href");
                result.author = $(this).find(".cd b ce cf cg ch be bh fi ff fg bg bc au").children("a").text();

                var number = $('.hx hy w ap hz ia ib ic id as').length - 1;

                // Create a new Article in the database from the results
                db.Article.create(result)
                    .then(function (data) {
                        if (i == number) {
                            res.redirect('/article')
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        if (i == number) {
                            res.redirect('/article')
                        }
                    });
            });
        });
    });

    // GET route for getting all the articles from the database
    app.get("/article", function (req, res) {
        db.Article.find({}).sort({ _id: -1 })
            .then(function (data) {
                // After finding the articles successfully send them to the client
                res.json(data);
            }).catch(function (err) {
                res.render('404');
            });
    });

    // GET saved articles from the database
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).sort({ _id: -1 }).then(function (data) {
            // After finding saved articles, send them to the client
            res.json(data);
        }).catch(function (error) {
            res.render("404");
        });

    });

    // GET note by id
    app.get("/note/:id", function (req, res) {
        db.Article.find({ _id: req.params.id })
            .populate("notes")
            .then(function (data) {
                res.json(data);
            }).catch(function (error) {
                res.json(error);
            });
    });

    // POST a new note by id
    app.post("/note/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (newNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: newNote._id } });
            })
            .then(function (data) {
                res.json(data);
            }).catch(function (error) {
                res.json(error);
            });
    });

    // POST a new article by id
    app.post("/saveArticle/:id", function (req, res) {
        db.Article.update({ _id: req.params.id }, req.body)
            .then(function (data) {
                res.json(data);
            }).catch(function (error) {
                res.json(error);
            });
    });

    // Removes a saved article from the list of saved articles
    app.post("/removeArticle/:id", function (req, res) {
        db.Article.update({ _id: req.params.id }, req.body)
            .then(function (data) {
                res.redirect("/saved")
            }).catch(function (error) {
                res.json(error);
            });
    });

    // DELETES a note by id
    app.post("/deleteNote/:id", function (req, res) {
        db.Note.update({ _id: req.params.id }, req.body)
            .then(function (data) {
                res.json(data);
            }).catch(function (error) {
                console.log(error);
            })
    });
};