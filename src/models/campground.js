let mongoose = require("mongoose");

//  Define Schema
let campgroundSchema = mongoose.Schema(
    {
        name: String,
        imageUrl: String,
        description: String,
        author: {
            username: String,
            id: {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            }
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    }
);

//  Export Campground Model (Collection)
module.exports = mongoose.model("Campground", campgroundSchema);
