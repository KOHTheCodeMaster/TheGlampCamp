let Campground = require("./models/campground"),
    Comment = require("./models/comment");

let data = [
    {
        name: "Wild Woods",
        imageUrl: "https://images.pexels.com/photos/2212570/pexels-photo-2212570.jpeg",
        description: "forest growing in a natural uncultivated state."
    },
    {
        name: "Fun Forest",
        imageUrl: "https://images.pexels.com/photos/756780/pexels-photo-756780.jpeg",
        description: "Look for mini beasts and other wildlife."
    },
    {
        name: "High Hikers",
        imageUrl: "https://images.pexels.com/photos/2819557/pexels-photo-2819557.jpeg",
        description: "forest growing in a natural uncultivated state."
    },
    {
        name: "Sang Giri",
        imageUrl: "https://images.pexels.com/photos/2819554/pexels-photo-2819554.jpeg",
        description: "THE FIRST MOUNTAIN RAINFOREST GLAMPING IN BALI."
    }
]

function seedDB() {

    //  Remove All Campgrounds from DB
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        //  Insert the campgrounds in DB
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                    return;
                }

                //  Insert Sample Comment to each campground
                Comment.create(
                    {
                        author: "John Doe",
                        content: "Good One! :D"
                    }, function (err, comment) {
                        campground.comments.push(comment);
                        campground.save(function (err) {
                            if (err) console.log(err);
                        });
                    }
                );

            });
        });

    });
}

module.exports = seedDB;