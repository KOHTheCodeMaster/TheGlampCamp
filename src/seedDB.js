let Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");

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

    let seedingUser = {username: "johndoe"};
    let seedingUserPassword = "johndoe";

    //  Remove Seeding User - John Doe
    User.remove(seedingUser, function (err) {

        if (err) {
            console.log(err);
            return;
        }
        /*
                User.create(seedingUser, function (err, seedingUser) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    //  Update seedingUser id with seedingUser id
                    seedingUser.id = seedingUser._id;
                    console.log("Seeding User successfully created.\n" + seedingUser);
                });
        */

        //  Add Default Seeding User - John Doe
        User.register(seedingUser, seedingUserPassword, function (err, user) {
            if (err) {
                console.log(err);
                res.render("register");
            }
            seedingUser.id = user._id;
            console.log("Seeding User successfully created.\n" + user);

            //  Remove All Campgrounds from DB
            Campground.remove({}, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }

                //  Insert the campgrounds in DB
                data.forEach(function (seed) {
                    seed.author = seedingUser;
                    Campground.create(seed, function (err, campground) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        //  Insert Sample Comment to each campground
                        Comment.create(
                            {
                                author: {
                                    username: seedingUser.username,
                                    id: seedingUser.id
                                },
                                content: "Good One! :D"
                            }, function (err, comment) {
                                /*
                                                            //  Add the user to the comment
                                                            comment.author.username = seedingUser.username;
                                                            comment.author.id = seedingUser.id;
                                                            comment.save();
                                */

                                campground.comments.push(comment);
                                campground.save(function (err) {
                                    if (err) console.log(err);
                                    console.log("Comment Saved : " + comment);
                                });
                            }
                        );

                    });
                });

            });

        });

    });
}

module.exports = seedDB;