let mongoose = require("mongoose");

//  Define Schema
let campgroundSchema = mongoose.Schema(
    {
        name: String,
        imageUrl: String,
        description: String,
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
