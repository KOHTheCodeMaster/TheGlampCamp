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
router.post("/", function (req, res) {

    //  Retrieve request parameters
    let newCamp = {name: req.body.name, imageUrl: req.body.imageUrl, description: req.body.description};

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
router.get("/new", function (req, res) {
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

module.exports = router;
