const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    userID:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    address: [{
        addresstype:{
            type:String,
            required:true

        },
        name: {
            type: String,
            required: true
        },
        housename:{
            type: String,
            required: true
        },
        landmark: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        altphone: {
            type: Number,
            required: true
        }
    }]
}, {
    versionKey: false, 
  
});



const address = mongoose.model("address",addressSchema);

module.exports = address;