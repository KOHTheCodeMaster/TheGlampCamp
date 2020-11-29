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
    {
        name: "Wild Woods",
        campId: 101,
        imageUrl: "https://images.pexels.com/photos/2212570/pexels-photo-2212570.jpeg"
    },
    {
        name: "Fun Forest",
        campId: 102,
        imageUrl: "https://images.pexels.com/photos/756780/pexels-photo-756780.jpeg"
    },
    {
        name: "High Hikers",
        campId: 103,
        imageUrl: "https://images.pexels.com/photos/2819557/pexels-photo-2819557.jpeg"
    },
    {
        name: "Sang Giri",
        campId: 104,
        imageUrl: "https://images.pexels.com/photos/2819554/pexels-photo-2819554.jpeg"
    },
    {
        name: "Wild Woods",
        campId: 105,
        imageUrl: "https://images.pexels.com/photos/2212570/pexels-photo-2212570.jpeg"
    },
    {
        name: "Fun Forest",
        campId: 106,
        imageUrl: "https://images.pexels.com/photos/756780/pexels-photo-756780.jpeg"
    },
    {
        name: "High Hikers",
        campId: 107,
        imageUrl: "https://images.pexels.com/photos/2819557/pexels-photo-2819557.jpeg"
    },
    {
        name: "Sang Giri",
        campId: 108,
        imageUrl: "https://images.pexels.com/photos/2819554/pexels-photo-2819554.jpeg"
    }
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

