let mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

//  Define Schema
let userSchema = mongoose.Schema(
    {
        username: String,
        password: String,
    }
);

userSchema.plugin(passportLocalMongoose);

//  Export Campground Model (Collection)
module.exports = mongoose.model("User", userSchema);
