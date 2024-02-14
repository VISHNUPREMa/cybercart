const User = require("../../model/userModel");
const Category = require("../../model/category");
const Products = require("../../model/productmanage");


const loadProductDetails = async(req,res)=>{
    try{
        const productID = req.params.id;
       
        
        const products = await Products.findById(productID)
      
        res.render("user/productdetails",{user:true,products});

    }
    catch(error){
        console.log(error,"loadProductDetails page error");
    }
}



module.exports = {loadProductDetails}