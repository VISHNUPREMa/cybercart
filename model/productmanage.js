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
        type: String,
        required: true
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
    ]
   
}, { versionKey: false });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
