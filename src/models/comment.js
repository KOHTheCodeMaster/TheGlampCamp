let mongoose = require("mongoose");

//  Define Schema
let commentSchema = mongoose.Schema(
    {
        author: String,
        content: String,
        numOfLikes: {type: Number, default: 0}
    }
);

//  Export Campground Model (Collection)
module.exports = mongoose.model("Comment", commentSchema);
