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
        imageUrl: String
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

//  Campgrounds page route
app.get("/campgrounds", function (req, res) {

    //  Find all the campgrounds from DB
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
            return;
        }
        //  Render all the campgrounds fetched from DB
        res.render("campgrounds", {campgrounds: campgrounds});
    });

});

//  Campgrounds post page route
app.post("/campgrounds", function (req, res) {

    //  Retrieve request parameters
    let name = req.body.name;
    let imageUrl = req.body.imageUrl;
    let newCamp = {name: name, imageUrl: imageUrl};

    //  Add new item to campgrounds collection
    Campground.create(newCamp, function (err, campground) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("New Campground Added." + campground);
        //  Redirect to /campgrounds
        res.redirect("campgrounds");

    });

});

//  Campgrounds page route
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});


//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

