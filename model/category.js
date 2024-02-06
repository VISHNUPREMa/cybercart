const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        

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



const Category = mongoose.model('Category', categorySchema);


module.exports = Category;