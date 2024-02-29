const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

  status: {
      type: String,
      default: 'confirmed'
  },
  name:{
    type:String,
    required:true
  },
  brand:{
    type:String,
    required:true
  },
  specification:{
    type:String,
    required:true
  },
  isListed:{
    type:Boolean,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  offerprice:{
    type:Number,
    required:true
  },
  quantity:{
    type:Number,
    required:true
  },
  image:{
    type:Array,
    required:true
  }
});

const orderSchema = mongoose.Schema({
    orderId:{
       type:String,
       required:true
     },
    products:{
        type:[productSchema],
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
        type:String,
        required:true
      },
      status:{
        type:String,
        required:true
      },
      reason:{
        type:String
      },
      cart:{
        type:Array,
        required:true

      }
},{versionKey:false})

const Orders = mongoose.model("order",orderSchema);
module.exports = Orders;


