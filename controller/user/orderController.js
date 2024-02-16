const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema");
const Products = require("../../model/productmanage");
const Orders = require("../../model/orderSchema");
const moment = require('moment-timezone');
const {ObjectId} = require("mongodb");
const {orderIdGenerate} = require("../../helper/otpGenerate")


const loadCheckoutPage = async(req,res)=>{
    try{
        const cartData =  req.session.cartData;
        const totalAmount =  req.query.total;
        

        
        const userID = req.session.user;
        const userData = await Users.findById(userID);
       
        const addressData = await Address.findOne({userID:userID});
      
        
    
        res.render("user/checkout",{data:cartData , grandTotal:totalAmount,address:addressData,user:userData});


   

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
    const cartDetails =  userDetails.cart;
  
  
    const orderId = orderIdGenerate()
    const orderDetails = await Orders.create({
        orderId:orderId,
        products:products,
        totalprice:totalAmount,
        address:address,
        payment:paymentMode,
        userid:userid,
        cart:cartDetails,



        createdon: moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
        status:"Confirmed",
        })

       
        for (const cartItem of orderDetails.cart) {
            const eachProductID = cartItem.id;
            const quantityToSubtract = parseInt(cartItem.quantity);

            await Users.findOneAndUpdate(
                { _id: userid }, 
                { $unset: { cart: "" } } 
              );
            
           
            await Products.findByIdAndUpdate(
                eachProductID,
                { $inc: { quantity: -quantityToSubtract } },
                { new: true }
            );

            res.json({ res:true,message:"orderplaced" });
        }
        

    }
    catch(error){
        console.log(error,"postorderDetails page error");
    }
}


const loadOrderDetailPage = async(req,res)=>{
    try{
        const orderID = req.query.id;
        const orderDetails = await Orders.findById(orderID);
        
        res.render("user/orderdetails",{user:true,order:orderDetails});

    }
    catch(error){
        console.log(error, "loadOrderDetailPage  page error ");
    }
}









const deleteOrder = async(req,res)=>{
    try{
        const orderId = req.body.orderId.trim(); 

        const orderDetails = await Orders.findById(orderId);
        for(let item of orderDetails.cart){
            try{
                await Products.updateOne(
                    {_id:item.id},
                    { $inc: { quantity: item.quantity }}
                )

            }
            catch(error){
                console.log(error);
              
            }
        }
        await Orders.findByIdAndDelete(orderId);
        res.status(200).json({ success: true, message: "Your order has been deleted" });
        
      
      

    }
    catch(error){
        console.log(error,"deleteOrder  page error");
    }
}



module.exports = {
    loadCheckoutPage,
    postorderDetails,
    loadOrderDetailPage,
    deleteOrder
}
