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
            //  Add the comment to the campground
            campground.comments.push(comment);
            campground.save();

            //  Redirect back to the respective campground
            res.redirect("/index/" + campground._id);
        });

    });

});


//  Check User Logged In
function isLoggedIn(req, res, next) {
    //  If user is authenticated, continue executing the followed up method
    if (req.isAuthenticated()) next();
    //  If user ain't authenticated, redirect to /login
    else res.redirect("/login");
}

module.exports = router;
