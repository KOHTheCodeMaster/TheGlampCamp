let express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground");
Comment = require("../models/comment");

//  ==============================
//  COMMENTS Routes
//  ==============================

//  NEW - form for new comment to be added to specific campground by id
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) console.log(err);
        else res.render("comment/new", {campground: campground});
    });
});

//  POST - new comment to the campground by id
router.post("/", isLoggedIn, function (req, res) {

    //  Find the specific campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            return;
        }
        //  Create the comment
        Comment.create(req.body.comment, function (err, comment) {
            if (err) {
                console.log(err);
                return;
            }
            //  Add the user to the comment
            comment.author.username = req.user.username;
            comment.author.id = req.user._id;
            comment.save();
            //  Add the comment to the campground
            campground.comments.push(comment);
            campground.save();

            //  Redirect back to the respective campground
            res.redirect("/index/" + campground._id);
        });

    });

});


//  EDIT - show edit form for comment
router.get("/:commentId/edit", checkCommentAuthorization, function (req, res) {

    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            return;
        }

        Comment.findById(req.params.commentId, function (err, comment) {
            if (err) {
                console.log(err);
                return;
            }
            res.render("comment/edit", {campground: campground, comment: comment});
        });

    });

});

//  PUT - update the particular comment of the campground by id
router.put("/:commentId", checkCommentAuthorization, function (req, res) {

    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function (err, comment) {
        if (err) console.log(err);
        res.redirect("/index/" + req.params.id);
    });

});

//  DESTROY - delete the particular comment of the campground by id
router.delete("/:commentId", checkCommentAuthorization, function (req, res) {

    Comment.findByIdAndRemove(req.params.commentId, function (err, comment) {
        if (err) console.log(err);
        res.redirect("/index/" + req.params.id);
    });

});

//  Check User Logged In
function isLoggedIn(req, res, next) {
    //  If user is authenticated, continue executing the followed up method
    if (req.isAuthenticated()) next();
    //  If user ain't authenticated, redirect to /login
    else res.redirect("/login");
}

//  Check comment authorization
function checkCommentAuthorization(req, res, next) {
    //  If user is authenticated, continue executing the followed up method
    if (req.isAuthenticated()) {

        //  Find the campground
        Comment.findById(req.params.commentId, function (err, comment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            //  Check comment authorization of current user
            if (comment.author.id.equals(req.user._id)) next();
            else res.redirect("back");
        });
    }
    //  If user ain't authenticated, redirect back to the last page
    else res.redirect("back");
}

module.exports = router;
