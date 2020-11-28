let express = require("express");
let app = express();

//  App Configuration
//  --------------------------------------------------

// app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


//  Setup Data
//  --------------------------------------------------

let campData = [
    {name: "Wild Woods", campId: 101},
    {name: "High Hikers", campId: 102},
    {name: "Fun Forest", campId: 103}
];


//  Setup Routes
//  --------------------------------------------------

//  Home page route
app.get("/", function (req, res) {
    res.render("home");
});

//  Campgrounds page route
app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {campData: campData});
});


//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

