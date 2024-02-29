
const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema({
    brand:{
        type:String
         },
    category:{
        type:String
    },
    discount:{
        type:Number,
        required:true
    },
    purchaseamount:{
        type:Number,
        required:true
    },
    start:{
        type:String,
        required:true

    },
    end:{
        type:String,
        required:true
    },
    type:{
        type:String
    }

},{versionKey:false})


const Offers = mongoose.model("offers",offerSchema);

module.exports = Offers
