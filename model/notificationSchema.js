
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    sentbtuser:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    orderid:{
        type:String
    },
    message:{
        type:String,
    }
},{versionKey:false})

const Notification = mongoose.model("notification",notificationSchema);

module.exports = Notification


