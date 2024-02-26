const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema");
const Products = require("../../model/productmanage");
const Orders = require("../../model/orderSchema");
const Coupons = require("../../model/couponSchema");

const moment = require('moment-timezone');
const razorPay = require("razorpay");
const {RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET} = process.env;
const {ObjectId} = require("mongodb");
const {orderIdGenerate} = require("../../helper/otpGenerate");
const crypto = require("crypto");


const razorpayInstance = new razorPay({
    key_id:RAZORPAY_KEY_ID,
    key_secret:RAZORPAY_KEY_SECRET
})


const loadCheckoutPage = async(req,res)=>{
    try{
        const cartData =  req.session.cartData;
       
        const totalAmount =  req.query.total;
        if (!cartData || cartData.length === 0 || totalAmount <= 0) {
           
            res.redirect("/shop");
        }
        
        

        
        const userID = req.session.user;
        const userData = await Users.findById(userID);
       
        const addressData = await Address.findOne({userID:userID});
        const discount = 0;
      
        
    
        res.render("user/checkout",{data:cartData , discount:discount , grandTotal:totalAmount,address:addressData,user:userData});


   

    }
    catch(error){
        console.log(error,"loadCheckoutPage  page error");
    }
}



const applyCoupon = async(req,res)=>{
    try{
        const couponCode = req.body.couponcode;
        const grandtotal = req.body.total
        const coupon = await Coupons.findOne({name:couponCode});
        const userid = req.session.user;

        if(coupon && coupon.isList){
            if(coupon.usedByUsers.includes(userid)){
                res.status(404).json({message:"Coupon already used "})

            }
        }
        
        if(coupon && coupon.isList ){
            
            const currentDate = new Date();
            if(currentDate >= coupon.start && currentDate <= coupon.end){
                newTotal = Number(grandtotal) - Number(coupon.discount)
                await Coupons.updateOne(
                    { _id: coupon._id },
                    { $addToSet: { usedByUsers: userid } }
                );
                
                
                res.status(200).json({ success: true, discount: coupon.discount, total : newTotal });
                
               
                return;
            }else{
                res.status(404).json({message:"Coupon expired !!!"})
            }
        }else{
            newTotal = Number(grandtotal)

            res.json({ success: true, discount: coupon.discount, total : newTotal });




            
        }

       
        

    }
    catch(error){
        console.log(error,"applyCoupon  page error");
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
        const products = await Products.find({_id:{$in:productIDs}});
        const address = await Address.findOne({"address._id":addressID});
        const selectedAddress = address.address.find(addr => addr._id.toString() === addressID);

        const cartDetails = userDetails.cart;
        const orderId = orderIdGenerate();
        const orderDetails = await Orders.create({
            orderId: orderId,
            products: products,
            totalprice: totalAmount,
            address: selectedAddress,
            payment: paymentMode,
            userid: userid,
            cart: cartDetails,
            createdon: moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
            status: "Confirmed",
        });

      
        

        if(paymentMode === "Cash On Delivery"){
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
            }
           await orderDetails.save();

            res.json({ res: true,method:"Cash On Delivery", message: "orderplaced" });
        } else if(paymentMode === "UPI"){
            
           

          
            const options = {
                amount: totalAmount * 100, 
                currency: 'INR',
                receipt: orderId, 
               
            };

            razorpayInstance.orders.create(options, async function (err, order) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Failed to create Razorpay order" });
                    return;
                }else{
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
                    }
                    await orderDetails.save();
                   
                    

               
                res.json({ payment:false,method:"UPI",razorpayOrder:order,order:orderDetails});
                }
            });
        

          
          

            
          
        }
    } catch(error){
        console.log(error, "postorderDetails page error");
        res.status(500).json({ error: "Internal server error" });
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



const deleteSingleProduct = async(req,res)=>{
    try{
        const orderid = req.query.orderid;
        
        const productID = req.query.productid;
        const quantity = parseInt(req.query.quantity);

        

        
        let total = parseInt(req.query.total);

        
     
        let subTotal = parseInt(req.query.subtotal);
        
       
        const orderData = await Orders.findById(orderid);
        const productData = await Products.findById(productID);

     
     

        const deleteProductIndex = orderData.products.findIndex(product => product && product._id && product._id.toString() === productID.toString());
       
        if (deleteProductIndex !== -1) {
            total -= subTotal;
            orderData.products[deleteProductIndex].status = "cancelled";
            if(orderData.products[deleteProductIndex].status === "cancelled"){
                productData.quantity += quantity;
                await productData.save();
                
            }
        }
        


        orderData.totalprice = total;
      
        await orderData.save();
        res.redirect("/orderdetails?id=" + orderid);

    }
    catch(error){
        console.log(error,"deletesingleproduct page error");
    }
}













const deleteOrder = async(req,res)=>{
    try{
        const orderId = req.body.orderId.trim(); 

        const orderDetails = await Orders.findById(orderId);
    
        for(let item of orderDetails.cart){
            try{

                const products = orderDetails.products.find(prod=>prod._id.toString() === item.id);
                if(products && products.status === 'confirmed'){
                await Products.updateOne(
                    {_id:item.id},
                    { $inc: { quantity: item.quantity }}
                )
            }

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


const verifyRazorpay = async(req,res)=>{
    try{
        const {order,payment} = req.body;
        console.log("order : ",order);
        console.log("payment : ",payment);
        let hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
        hmac.update(
            `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`
        );
        hmac = hmac.digest("hex");
        if(hmac === payment.razorpay_signature){
            res.json({status:true,message:"hello everyone"})
        }else{
            res.json({status:false})
        }
  


    }
    catch(error){
        console.log(error);
    }
}






module.exports = {
    loadCheckoutPage,
    applyCoupon,
    postorderDetails,
    loadOrderDetailPage,
    deleteOrder,
    deleteSingleProduct,
    verifyRazorpay,
 
}
