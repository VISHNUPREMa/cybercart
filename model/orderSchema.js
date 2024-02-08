const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    products:{
        type:Array,
        required:true
      },
      totalprice:{
        type:Number,
        required:true
      },
      address:{
        type:Array,
        required:true
      },
      payment:{
        type:String,
        required:true
      },
      userid:{
        type:String,
        required:true
      },
      createdon:{
        type:Date,
        required:true
      },
      status:{
        type:String,
        required:true
      }
},{versionKey:false})

const Orders = mongoose.model("order",orderSchema);
module.exports = Orders;


