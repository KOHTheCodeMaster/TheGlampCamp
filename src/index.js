let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    app = express();

//  App Configuration
//  --------------------------------------------------

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


//  Setup MongoDB Database
//  --------------------------------------------------

//  Establish Connection with DB
mongoose.connect("mongodb://localhost:27017/TheGlampCamp", function (err) {
    if (err) console.log(err);
    else console.log("Connection To MongoDB Established successfully.")
});

//  Define Schema
let campgroundSchema = mongoose.Schema(
    {
        name: String,
        imageUrl: String,
        description: String
    }
);

//  Define Campground Model (Collection)
let Campground = mongoose.model("Campground", campgroundSchema);


//  Setup Routes
//  --------------------------------------------------

//  Home page route
app.get("/", function (req, res) {
    res.render("home");
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
        res.render("index", {campgrounds: campgrounds});
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
            res.redirect("index");
        }
    });

});

//  NEW - form for new campground
app.get("/index/new", function (req, res) {
    res.render("new");
});

//  SHOW - particular campground by id
app.get("/index/:id", function (req, res) {

    let id = req.params.id;
    Campground.findById(id, function (err, campground) {
        if (err) console.log(err);
        else res.render("show", {campground: campground});
    });

});


//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

