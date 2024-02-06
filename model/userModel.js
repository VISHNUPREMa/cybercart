const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile: {
        type: Number,
        required:true,
        unique: true,
      
    },
    password:{
        type:String,
        require:true
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
        
    },
    isAdmin:{
        type:Number,
        default:0,
        required:true
    },
    cart:{
        type:Array
    }

},{versionKey:false})


const User = mongoose.model("user",userSchema);
module.exports = User;