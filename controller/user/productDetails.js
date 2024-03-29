const User = require("../../model/userModel");
const Category = require("../../model/category");
const Products = require("../../model/productmanage");
const Reviews = require("../../model/review");
const Orders = require("../../model/orderSchema")


const mongoose = require('mongoose');


const loadProductDetails = async(req,res)=>{
    try{
        const productID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productID)) {
            // If the productId is not a valid ObjectId, respond with an error page
            res.render("general/error")
        }
        const userid = req.session.user;
        const orderData = await Orders.find({"products._id":productID,userid: userid})
  
        
       
        
        const productsData = await Products.findById(productID);
        
       
        const reviews = await Reviews.aggregate([
            {
                $match: { product: new mongoose.Types.ObjectId(productID) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewbyuser",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            }
        ]);

     

        

if(userid){
    res.render("user/productdetails",{user:true,products:productsData,reviews,order:orderData});
}else{
    res.render("user/productdetails",{user:false,products:productsData,reviews,order:orderData});
}

    }
    catch(error){
        console.log(error,"loadProductDetails page error");
        res.render("general/error")
    }
}



module.exports = {loadProductDetails}





























