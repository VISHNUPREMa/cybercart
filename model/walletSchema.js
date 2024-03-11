const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
        },
        data:{
            type:Array,
            required:true
        }
},{versionKey:false});


const Wallet = mongoose.model("wallets",walletSchema);
module.exports = Wallet




