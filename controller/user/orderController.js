const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema");
const Products = require("../../model/productmanage");
const Orders = require("../../model/orderSchema")


const loadCheckoutPage = async(req,res)=>{
    try{
        const cartData =  req.session.cartData;
        const totalAmount =  req.session.grandTotal;
        const userID = req.session.user;
        const addressData = await Address.findOne({userID:userID});
      
        
    
        res.render("user/checkout",{data:cartData , grandTotal:totalAmount,address:addressData});


        // console.log("cart data details : ",cartData);
        // console.log("total amount is : ",totalAmount);
        // console.log("user id : ",userID);

    }
    catch(error){
        console.log(error,"loadCheckoutPage  page error");
    }
}

const postorderDetails = async(req,res)=>{
    try{
        const addressID = req.body.addressId;
        const totalAmount = req.body.total;
        const paymentMode = req.body.paymentmode;

        const userid = req.session.user;
        const userDetails = await Users.findById(userid);

    const productIDs = userDetails.cart.map(item=>item.id);
    const products = await Products.find({_id:{$in:productIDs }});
    const address  = await Address.findOne({"address._id":addressID});
    
    const orderDetails = await Orders.create({
        products:products,
        totalprice:totalAmount,
        address:address,
        payment:paymentMode,
        userid:userid,
        createdon:Date.now(),
        status:"confirmed",
        })

        if(orderDetails.status === "confirmed"){
            res.json({ res:true,message:"orderplaced" });
            await Users.findOneAndUpdate(
                { _id: userid }, 
                { $unset: { cart: "" } } 
              );
           

        }




    // console.log("products are : ",products);
    //     console.log("userdetails : ",userDetails);
    //     console.log("product ids : ",productIDs);
    //     console.log([addressID,totalAmount,paymentMode]);
    // console.log("address : ",address);
    // console.log("order schema : ",orderDetails);
        
        
       


    }
    catch(error){
        console.log(error,"postorderDetails page error");
    }
}

module.exports = {
    loadCheckoutPage,
    postorderDetails
}
