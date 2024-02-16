const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true
        },
        data:{
            type:Array
        }
},{versionKey:false})

const wishlist = mongoose.model("wishlist",wishlistSchema);
module.exports = wishlist;