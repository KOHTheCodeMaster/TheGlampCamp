let express = require("express"),
    Campground = require("../models/campground"),
    router = express.Router();

//  Setup Routes
//  --------------------------------------------------

// INDEX - Campgrounds index page route
router.get("/", function (req, res) {

    //  Find all the campgrounds from DB
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
            return;
        }
        //  Render all the campgrounds fetched from DB
        res.render("campground/index", {campgrounds: campgrounds});
    });

});

//  CREATE - Campgrounds post page route
router.post("/", isLoggedIn, function (req, res) {

    //  Retrieve request parameters
    let author = {
        username: req.user.username,
        id: req.user._id
    }
    let newCamp = {name: req.body.name, imageUrl: req.body.imageUrl, description: req.body.description, author: author};

    //  Add new item to campgrounds collection
    Campground.create(newCamp, function (err, campground) {
        if (err) console.log(err);
        else {
            console.log("New Campground Added." + campground);
            //  Redirect to /index
            res.redirect("/");
        }
    });

});

//  NEW - form for new campground
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campground/new");
});

//  SHOW - particular campground by id
router.get("/:id", function (req, res) {

    Campground.findById(req.params.id).populate("comments")
        .exec(function (err, campground) {
            if (err) console.log(err);
            else res.render("campground/show", {campground: campground});
        });

});

//  EDIT - show edit form for campground
router.get("/:id/edit", checkCampgroundAuthorization, function (req, res) {

    Campground.findById(req.params.id, function (err, campground) {
        if (err) console.log(err);
        else res.render("campground/edit", {campground: campground});
    });

});

//  PUT - update the particular campground by id
router.put("/:id", checkCampgroundAuthorization, function (req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
        if (err) console.log(err);
        res.redirect("/index/" + campground._id);
    });

});

//  DESTROY - delete the particular campground by id
router.delete("/:id", checkCampgroundAuthorization, function (req, res) {

    Campground.findByIdAndRemove(req.params.id, function (err, campground) {
        if (err) console.log(err);
        res.redirect("/index/");
    });

});

//  ==============================
//  Middlewares
//  ==============================

//  Check User Logged In
function isLoggedIn(req, res, next) {
    //  If user is authenticated, continue executing the followed up method
    if (req.isAuthenticated()) next();
    //  If user ain't authenticated, redirect to /login
    else res.redirect("/login");
}

//  Check Campground Authorization
function checkCampgroundAuthorization(req, res, next) {
    //  If user is authenticated, continue executing the followed up method
    if (req.isAuthenticated()) {

        //  Find the campground
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            //  Check authorization of current user
            if (campground.author.id.equals(req.user._id)) next();
            else res.redirect("back");
        });
    }
    //  If user ain't authenticated, redirect back to the last page
    else res.redirect("back");
}


module.exports = router;
