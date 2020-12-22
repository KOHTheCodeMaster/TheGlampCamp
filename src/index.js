let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    seedDB = require("./seedDB"),
    app = express();

//  Routes
let indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comment"),
    authRoutes = require("./routes/auth");

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

//  append default urls before the routes
app.use("/index", indexRoutes);
app.use("/index/:id/comments/", commentRoutes);
app.use(authRoutes);

//  Setup MongoDB Database
//  --------------------------------------------------

//  Establish Connection with DB
mongoose.connect("mongodb://localhost:27017/TheGlampCamp_v1_0_6", function (err) {
    if (err) console.log(err);
    else console.log("Connection To MongoDB Established successfully.")
});

//  Seed DB
seedDB();

//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

