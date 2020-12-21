let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seedDB"),
    app = express();

//  App Configuration
//  --------------------------------------------------

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//  Passport configuration
app.use(require("express-session")({
    secret: "This is the secret Key..!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Common middleware which runs before each route to update currentUser for partials & other resources
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//  Setup MongoDB Database
//  --------------------------------------------------

//  Establish Connection with DB
mongoose.connect("mongodb://localhost:27017/TheGlampCamp_v1_0_6", function (err) {
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
            res.redirect("/index");
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
app.get("/index/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) console.log(err);
        else res.render("comment/new", {campground: campground});
    });
});

//  POST - new comment to the campground by id
app.post("/index/:id/comments", isLoggedIn, function (req, res) {

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


//  ==============================
//  REGISTER Routes
//  ==============================

//  Render Register form
app.get("/register", function (req, res) {
    res.render("user/register");
});

//  Register new user
app.post("/register", function (req, res) {

    let newUser = {username: req.body.username};

    //  Register new user
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        //  Authenticate the user & redirect to /index
        passport.authenticate("local")(req, res, function () {
            res.redirect("/index");
        });
    });

});


//  ==============================
//  LOGIN Routes
//  ==============================

//  Logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/index");
});

//  Render Login form
app.get("/login", function (req, res) {
    res.render("user/login");
});

//  Register new user
app.post("/login",
    //  Authenticate login middleware
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/login"
    }),
    function (req, res) {
        console.log("Logged In successful - " + req.user);
    }
);


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


//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

