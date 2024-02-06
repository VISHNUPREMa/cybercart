const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema");
const Products = require("../../model/productmanage");


const loadCheckoutPage = async(req,res)=>{
    try{
        const cartData =  req.session.cartData;
        const totalAmount =  req.session.grandTotal;
        const userID = req.session.user;
        
    
        res.render("user/checkout",{data:cartData , grandTotal:totalAmount});


        // console.log("cart data details : ",cartData);
        // console.log("total amount is : ",totalAmount);
        // console.log("user id : ",userID);

    }
    catch(error){
        console.log(error,"loadCheckoutPage  page error");
    }
}

module.exports = {loadCheckoutPage}
