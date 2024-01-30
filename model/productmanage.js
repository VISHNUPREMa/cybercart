const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isListed: {
        type: Boolean,
        required: true,
        default: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
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
    image:{
        data: Buffer,
        contentType: String,
    }
   
}, { versionKey: false });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
