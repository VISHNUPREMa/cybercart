const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
    messagedat:{
        type:String
    }

},{versionKey:false})

const Message = mongoose.model("message",messageSchema);
module.exports = Message;



