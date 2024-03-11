const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewbyuser:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'

    },
    star:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    product:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    createdon:{
        type:String,
        
    }

},{versionKey:false})


const Review = mongoose.model("review",reviewSchema);

module.exports = Review