const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique: true
        

    },
    
    description:{
        type:String
    },

    isList:{
        type:Boolean,
        required:true,
        default:true
    }

},{versionKey:false})



const Category = mongoose.model('category', categorySchema);


module.exports = Category;
