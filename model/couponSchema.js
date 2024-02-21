const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
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
        type:Date,
        required:true
    },
    end:{
        type:Date,
        required:true
    },
    isList:{
        type:Boolean,
        required:true,
        default:true
    },
    usedByUsers: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
    
},{versionKey:false})


const Coupons = mongoose.model("coupons",couponSchema);
module.exports = Coupons
