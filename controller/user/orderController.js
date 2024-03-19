const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema");
const Products = require("../../model/productmanage");
const Orders = require("../../model/orderSchema");
const Coupons = require("../../model/couponSchema");
const Wallet = require("../../model/walletSchema");
const Notification = require("../../model/notificationSchema")

const moment = require('moment-timezone');
const razorPay = require("razorpay");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
const { ObjectId } = require("mongodb");
const { orderIdGenerate } = require("../../helper/otpGenerate");
const crypto = require("crypto");


const razorpayInstance = new razorPay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
})


const loadCheckoutPage = async (req, res) => {
    try {
        const cartData = req.session.cartData ;

        const totalAmount = req.query.total;
        if (!cartData || cartData.length === 0 || totalAmount <= 0) {

            res.redirect("/shop");
        }




        const userID = req.session.user;
        const userData = await Users.findById(userID);

        const addressData = await Address.findOne({ userID: userID });
        const discount = 0;
        const deliverycharge = await Orders.find({deliverycharge:500})


        



        res.render("user/checkout", { data: cartData, discount: discount, grandTotal: totalAmount, address: addressData, user: userData });




    }
    catch (error) {
        console.log(error, "loadCheckoutPage  page error");
    }
}



const applyCoupon = async (req, res) => {
    try {
        const couponCode = req.body.couponcode;
        const grandtotal = req.body.total;
        const coupon = await Coupons.findOne({ name: couponCode });
        const userid = req.session.user;

        let newTotal;

        if (coupon && coupon.isList) {
            if (coupon.usedByUsers.includes(userid)) {
                return res.status(404).json({ message: "Coupon already used" });
            }

            const currentDate = new Date();
            if (currentDate >= coupon.start && currentDate <= coupon.end) {
                if(coupon.purchaseamount <= grandtotal){
                    newTotal = Number(grandtotal) - Number(coupon.discount);
                await Coupons.updateOne(
                    { _id: coupon._id },
                    { $addToSet: { usedByUsers: userid } }
                );
                req.session.discountApplied = coupon.discount;

                return res.status(200).json({ success: true, discount: coupon.discount, total: newTotal });
                }else{
                    return res.status(404).json({ message: `coupon is valid for minimum ${coupon.purchaseamount} rs products` });

                }
            } else {
                return res.status(404).json({ message: "Coupon expired" });
            }
        } else {
            newTotal = Number(grandtotal);
            return res.status(200).json({ success: true, discount: 0, total: newTotal });
        }
    } catch (error) {
        console.error(error, "Error on applyCoupon page");
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const postorderDetails = async (req, res) => {
    try {
        const addressID = req.body.addressId;
        const totalAmount = req.body.total;
        const paymentMode = req.body.paymentmode;

        const userid = req.session.user;
        const userObjectId = new ObjectId(userid)
        const userDetails = await Users.findById(userid);
         
        const orderData = await Users.aggregate([
            { $match: { _id: userObjectId } },
            { $unwind: "$cart" },
            {
                $project: {
                    cart: {
                        $mergeObjects: [
                            "$cart",
                            { id: { $toObjectId: "$cart.id" } } // Convert string to ObjectId
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "cart.id",  // Field in the current collection (Users)
                    foreignField: "_id",     // Field in the referenced collection (products)
                    as: "product"
                }
            },
            { $unwind: "$product" }
        ]);
        
       
        let products = [];
        for(let item of orderData){
            item.product.quantity = item.cart.quantity;
            products.push(item.product)

        }

        

        
        

    
        const address = await Address.findOne({ "address._id": addressID });
        const selectedAddress = address.address.find(addr => addr._id.toString() === addressID);

        const cartDetails = userDetails.cart;
       
        const orderId = orderIdGenerate();
        const couponApplied = req.session.discountApplied ? req.session.discountApplied : 0;
       

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
            deliverycharge: Number(500),
            couponapplied: Number(couponApplied)
        });
        delete req.session.discountApplied;
        
        

        req.session.orderDetails = orderDetails;
        
        
        




        if (paymentMode === "Cash On Delivery") {
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

            res.json({ res: true, method: "Cash On Delivery", message: "orderplaced" });
        } else if (paymentMode === "UPI") {




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
                } else {

                    

                     res.json({ payment: false, method: "UPI", razorpayOrder: order,order:orderDetails});
                }
            });







        }
    } catch (error) {
        console.log(error, "postorderDetails page error");
        res.status(500).json({ error: "Internal server error" });
    }
}


const onlinePaymentFailed = async(req,res)=>{
    try{
        const paymentStatus = req.body.paymentFailed;
     
        const orderData = req.body.order;
        
        if(paymentStatus){
     
            
            const orderid = orderData[0]._id;
            const orderDetails = await Orders.findById(orderid);
            orderDetails.status = "payment Pending";
            await orderDetails.save();
            console.log("order details : ",orderDetails);

        }

        res.status(200).json({message :"Payment failed"})

        

    }
    catch(error){
        console.log("onlinePaymentFailed page error : ",error);
    }
}



const loadOrderDetailPage = async (req, res) => {
    try {
        const orderID = req.query.id;
        const orderDetails = await Orders.findById(orderID);

        res.render("user/orderdetails", { user: true, order: orderDetails });

    }
    catch (error) {
        console.log(error, "loadOrderDetailPage  page error ");
    }
}



const deleteSingleProduct = async (req, res) => {
    try {
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
            let allProductsCancelled = orderData.products.every(product => product.status === "cancelled");

        if (allProductsCancelled) {
            orderData.status = "Cancelled";
            if(orderData.deliverycharge !== undefined){
                orderData.deliverycharge = 0;
            }

            if(orderData.couponapplied !== undefined){
                orderData.couponapplied = 0;

            }
            
            
        }


            if (orderData.products[deleteProductIndex].status === "cancelled") {
                productData.quantity += quantity;
                await productData.save();

            }
        }



        orderData.totalprice = total;

        await orderData.save();

        
        res.redirect("/orderdetails?id=" + orderid);

    }
    catch (error) {
        console.log(error, "deletesingleproduct page error");
    }
}













const deleteOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId.trim();

        const orderDetails = await Orders.findById(orderId);

        for (let item of orderDetails.cart) {
            try {

                const products = orderDetails.products.find(prod => prod._id.toString() === item.id);
                if (products && products.status === 'confirmed') {
                    await Products.updateOne(
                        { _id: item.id },
                        { $inc: { quantity: item.quantity } }
                    )
                }

            }
            catch (error) {
                console.log(error);

            }
        }
        await Orders.findByIdAndDelete(orderId);
        res.status(200).json({ success: true, message: "Your order has been deleted" });




    }
    catch (error) {
        console.log(error, "deleteOrder  page error");
    }
}


const verifyRazorpay = async (req, res) => {
    try {
        const { order, payment } = req.body;
       
        let hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
        hmac.update(
            `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`
        );
        hmac = hmac.digest("hex");
        if (hmac === payment.razorpay_signature) {
            const orderid = req.session.orderDetails._id;
            const orderDetails = await Orders.findById(orderid);
            
            const userid = req.session.user;
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
            res.json({ status: true,  })

        } else {
            const orderid = req.session.orderDetails._id;
            const orderDetails = await Orders.findById(orderid);
            console.log("order failed : ",orderDetails);
            res.json({ status: false })
        }



    }
    catch (error) {
        console.log(error);
    }
}


const returnOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const userid = req.session.user;


        const notification = await Notification.create({
            sentbtuser: userid,
            orderid : orderId.trim(),
            message : reason.trim(),

        })

        console.log("notification : ",notification);

        
            res.status(200).json({message:"return order placed your money will credit to wallet after validation"})

    }
    catch (error) {
        console.log("returnOrder page error : ", returnOrder);
    }
}


const getInvoice = async (req, res) => {
    try {
        const orderId = req.query.id;
        const orderData = await Orders.findById(orderId) 
        const invoiceNumber = orderIdGenerate();
        
        res.render("user/invoice", { order: orderData, invoice: invoiceNumber });
    } catch (error) {
        console.log("Error retrieving invoice:", error);
        res.status(500).send("Internal Server Error");
    }
}


const continuePaymentForPaymentFail = async(req,res)=>{
    try{
        const orderid = req.query.id;
        const orderData = await Orders.findById(orderid);
        
        res.render("user/repayment",{order:orderData});
        

    }
    catch(error){
        console.log("continuePaymentForPaymentFail page error : ",continuePaymentForPaymentFail);
    }
}
  
 
const postRepaymentData = async(req,res)=>{
    try{
        const orderid = req.body.orderId;
        const newOrderPayment = req.body.paymentMethod
        const orderData = await Orders.findById(orderid);
        orderData.status = "Confirmed";
        const userid = req.session.user;
       
        if(newOrderPayment === "Cash on Delivery"){
        for (const cartItem of orderData.cart) {
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
        await orderData.save();
        res.status(200).json({message:"order placed successfully"})
     

    }else if(newOrderPayment === "UPI"){

        for (const cartItem of orderData.cart) {
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
        await orderData.save(); 
        
        const options = {
            amount: orderData.totalprice * 100,
            currency: 'INR',
            receipt: orderid,

        };

        razorpayInstance.orders.create(options, async function (err, order) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to create Razorpay order" });
                return;
            } else {

                

                 res.json({ payment: false, method: "UPI", razorpayOrder: order,order:orderData});
            }
        });

    }
        
       

    }
    catch(error){
        console.log("postRepaymentData page error : ",error);
    }
}


const cancelPendingOrder = async(req,res)=>{
    try{
        const orderid = req.body.id;
        const orderData = await Orders.findById(orderid);
        orderData.status = "Cancelled";
        await orderData.save();
        res.status(200).json({message:"Order cancelled successfully"})

    }catch(error){
       console.log("cancelPendingOrder page error : ",error); 
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
    returnOrder,
    getInvoice,
    onlinePaymentFailed,
    continuePaymentForPaymentFail,
    postRepaymentData,
    cancelPendingOrder
}
