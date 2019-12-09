$(document).ready(function () {
    $('.modal').modal();
});

$(document).on("click", ".scrape", function (e) {
    e.preventDefault();

    console.log("Scrape Sucessful")
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        console.log(data);
        $("#article-list").empty();
        for (var i = 0; i < data.length; i++) {
            if (data[i].saved == "true") {
                var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" +
                    data[i].photo + "'></div><div class='col s8'><h5>" +
                    data[i].userName + "</h5><p>" +
                    data[i].summary + "</p><p>By: " +
                    data[i].author + "</p><a href=''" +
                    data[i].url + "' class='btn indigo'><i class='far fa-file-alt'></i> View Full Article</a><p class='btn disabled'>Favorited Article</p></div></li><hr>"

                $("#article-list").prepend(newOne);
            } else {
                var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" +
                    data[i].photo + "'></div><div class='col s8'><h5>" +
                    data[i].userName + "</h5><p>" +
                    data[i].summary + "</p><p>By: " +
                    data[i].author + "</p><a href=''" +
                    data[i].url + "' class='btn indigo'><i class='far fa-file-alt'></i> View Full Article</a><button type='button' class='btn green' data-id='" +
                    data[i]._id + "' id='saveArticle'><i class='fas fa-archive'></i> Favorite This Article</button></div></li><hr>"

                $("#article-list").prepend(newOne);
            }
        };
    })
})

$(document).on("click", "#savedArticles", function (e) {
    e.preventDefault();

    console.log("Displaying Saved Articles")
    $.ajax({
        method: "GET",
        url: "/saved"
    }).then(function (data) {
        console.log(data);
        $("#article-list").empty();
        for (var i = 0; i < data.length; i++) {
            var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" +
                data[i].photo + "'></div><div class='col s8'><h5>" +
                data[i].userName + "</h5><p>" +
                data[i].summary + "</p><p>By: " +
                data[i].author + "</p><a href=''" +
                data[i].url + "' class='btn indigo'><i class='far fa-file-alt'></i> View Full Article</a><button type='button' class='btn light-blue' data-id='" +
                data[i]._id + "' data-sum='" +
                data[i].userName + " data-toggle='modal' id='seeNote'><i class='far fa-comments'></i> View Comments</button><button type='button' class='btn light-blue' data-id='" +
                data[i]._id + "' data-sum='" +
                data[i].userName + "' id='writeNote'><i class='far fa-comment-dots'></i> Compose Comment</button><button class='btn red' data-id='" +
                data[i]._id + "' id='deleteArticle'><i class='fas fa-minus-circle'></i> Un-Favorite Article</button></div></li><hr>"

            $("#article-list").prepend(newOne);
        };
    })
})

$(document).on("click", "#writeNote", function (e) {
    e.preventDefault();
    console.log("Note Modal Opened")
    var sum = $(this).attr("data-sum");
    var thisId = $(this).attr("data-id");
    $("#addComment").attr("data-id", thisId);
    $("#modalUserName").text(sum);
    $("#commentsModal").modal('open')
})

$(document).on("click", "#addComment", function (e) {
    e.preventDefault();
    $("#commentsModal").modal('close')
    console.log("Comment Added")
    var thisId = $(this).attr("data-id");
    var userName = $("#noteuserName").val();
    var body = $("#commentBody").val();

    $.ajax({
        method: "POST",
        url: "/note/" + thisId,
        data: {
            userName: userName,
            body: body
        }
    }).then(function (data) {
        console.log(data);
    });
    $("#noteuserName").val("");
    $("#commentBody").val("");
});

$(document).on("click", "#saveArticle", function (e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("Article Saved")
    $.ajax({
        method: "POST",
        url: "/saveArticle/" + thisId,
        data: {
            saved: "true"
        }
    }).then(function (data) {
        $("#saved").modal('open')
    });
});

$(document).on("click", "#deleteArticle", function (e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("Article deleted from saved articles")
    $.ajax({
        method: "POST",
        url: "/removeArticle/" + thisId,
        data: {
            saved: "false"
        }
    }).then(function (data) {
        console.log(data);
        $("#article-list").empty();
        for (var i = 0; i < data.length; i++) {
            if (data.saved == "false") {
                console.log("note deleted")
            } else {
                var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" +
                    data[i].photo + "'></div><div class='col s8'><h5>" +
                    data[i].userName + "</h5><p>" +
                    data[i].summary + "</p><p>By: " +
                    data[i].author + "</p><a href=''" +
                    data[i].url + "' class='btn btn-primary'>View Full Article</a><button type='button' class='btn btn-danger' data-id='" +
                    data[i]._id + "' data-sum='" +
                    data[i].userName + " data-toggle='modal' id='seeNote'>View Note</button><button type='button' class='btn btn-danger' data-id='" +
                    data[i]._id + "' data-sum='" +
                    data[i].userName + "' id='writeNote'>Compose Note</button><button class='btn btn-danger' data-id='" +
                    data[i]._id + "' id='deleteArticle'>Un-Favorite Article</button></div></li><hr>"

                $("#article-list").prepend(newOne);
            };
        };
    });
});

$(document).on("click", "#seeNote", function (e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("View Note")
    $.ajax({
        method: "GET",
        url: "/note/" + thisId
    }).then(function (data) {
        console.log(data);
        $("#modalNotes-content").empty();
        for (i = 0; i < data[0].notes.length; i++) {
            if (data[0].notes[i].saved == "false") {
                console.log("deleted")
            } else {
                var notes = "<div class='row'><div class='col s8><div id='singleNote' class='text-center'><h6>" +
                    data[0].notes[i].userName + "</h6><h6>" +
                    data[0].notes[i].body + "</h6></div><button class='btn col s3' id='deleteNote' data-noteId='" +
                    data[0].notes[i]._id + "' data-id='" +
                    data[0]._id + "'>Delete</button></div></div><hr>"

                $("#modalNotes-content").append(notes);
            };
        };
        $("#showModal").modal('open')
    });
});

$(document).on("click", "#deleteNote", function (e) {
    e.preventDefault();
    var thisId = $(this).attr("data-noteId");
    $("#showModal").modal('close')
    console.log("16")
    $.ajax({
        method: "POST",
        url: "/deleteNote/" + thisId,
        data: {
            saved: "false"
        }
    }).then(function (data) {
        console.log(data);
        $("#remove").modal('open')
    });
});