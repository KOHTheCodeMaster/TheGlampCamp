let express = require("express"),
    passport = require("passport"),
    User = require("../models/user"),
    router = express.Router();

//  Home page route
router.get("/", function (req, res) {
    res.render("campground/home");
});

//  ==============================
//  REGISTER Routes
//  ==============================

//  Render Register form
router.get("/register", function (req, res) {
    res.render("user/register");
});

//  Register new user
router.post("/register", function (req, res) {

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
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/index");
});

//  Render Login form
router.get("/login", function (req, res) {
    res.render("user/login");
});

//  Register new user
router.post("/login",
    //  Authenticate login middleware
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/login"
    }),
    function (req, res) {
        console.log("Logged In successful - " + req.user);
    }
);

module.exports = router;

