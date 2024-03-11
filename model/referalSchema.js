const mongoose = require("mongoose");
const referalSchema = new mongoose.Schema({
    owner:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    code:{
        type:String
    },
    usedby:{
        type:Array
    }
},{versionKey:false})


const Referal = mongoose.model("referal",referalSchema);
module.exports = Referal