const mongoose = require("mongoose");
const { array } = require("../helper/multerConfig");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    specification: {
        type: String,
        required:true
    },
    isListed: {
        type: Boolean,
        required: true,
        default: true,
    },
    category: {
        type:  mongoose.Schema.Types.ObjectId,
        ref :"category",
        required:true
        
    },
    price: {
        type: Number,
        required: true,
    },
    offerprice:{
        type: Number,
        required: true,

    },
    quantity: {
        type: Number,
        required: true,
    },
    image:[{
        type:String,
        required:true
    }
    ],
    discountApplied: {
        type: Boolean,
        default: false 
    }
   
}, { versionKey: false });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
