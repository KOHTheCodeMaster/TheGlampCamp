let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seedDB"),
    app = express();

//  App Configuration
//  --------------------------------------------------

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//  Setup MongoDB Database
//  --------------------------------------------------

//  Establish Connection with DB
mongoose.connect("mongodb://localhost:27017/TheGlampCamp_v1_0_5", function (err) {
    if (err) console.log(err);
    else console.log("Connection To MongoDB Established successfully.")
});

//  Seed DB
seedDB();


//  Setup Routes
//  --------------------------------------------------

//  Home page route
app.get("/", function (req, res) {
    res.render("campground/home");
});

// INDEX - Campgrounds index page route
app.get("/index", function (req, res) {

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
app.post("/index", function (req, res) {

    //  Retrieve request parameters
    let newCamp = {name: req.body.name, imageUrl: req.body.imageUrl, description: req.body.description};

    //  Add new item to campgrounds collection
    Campground.create(newCamp, function (err, campground) {
        if (err) console.log(err);
        else {
            console.log("New Campground Added." + campground);
            //  Redirect to /index
            res.redirect("campground/index");
        }
    });

});

//  NEW - form for new campground
app.get("/index/new", function (req, res) {
    res.render("campground/new");
});

//  SHOW - particular campground by id
app.get("/index/:id", function (req, res) {

    Campground.findById(req.params.id).populate("comments")
        .exec(function (err, campground) {
            if (err) console.log(err);
            else res.render("campground/show", {campground: campground});
        });

});

//  ==============================
//  COMMENTS Routes
//  ==============================

//  NEW - form for new comment to be added to specific campground by id
app.get("/index/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) console.log(err);
        else res.render("comment/new", {campground: campground});
    });
});

//  POST - new comment to the campground by id
app.post("/index/:id/comments", function (req, res) {

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


//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

