
const Notification = require("../../model/notificationSchema");
const Products = require("../../model/productmanage");
const Users = require("../../model/userModel");
const Orders = require("../../model/orderSchema");
const Wallet = require("../../model/walletSchema");


const moment = require("moment-timezone");

const validateProductReturn = async(req,res)=>{
    try{
        const notificationID = req.body.id;
        const notificationData = await Notification.findById(notificationID);
         const orderDetails = await Orders.findById(notificationData.orderid.trim());
         console.log("order details : ",orderDetails);
        

      
        for(let product of orderDetails.products){
            const eachProductID = product._id;
            const eachProductQuantity = Number(product.quantity);
            await Products.findByIdAndUpdate(
                eachProductID,
                { $inc: { quantity: eachProductQuantity } },
                { new: true }
            );


            
        }
        
        orderDetails.reason = notificationData.message;
        await orderDetails.save();
        const userid = notificationData.sentbtuser ;
        console.log("user id : ",userid);
        data={
            amount :Number(orderDetails.totalprice),
            createdOn :moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
            source:"Cancelled order"
        }
        
        // const userIdObject = mongoose.Types.ObjectId(userid);

        const walletData = await Wallet.findOne({userId:userid})
        console.log("wallet data : ", walletData);

        await Notification.findByIdAndDelete(notificationID);
       
        if(walletData){
            if(orderDetails.status === "Returned"){
                res.status(200).json({message:"Money already credited on  wallet"})
           
            }else{

                await Wallet.updateOne(
                    {userId : userid},
                    {$addToSet:{data:data}}
                )

                orderDetails.status = "Returned";
                await orderDetails.save();

            }
        }



        res.status(200).json({message:"return order validated"})

    }catch(error){

    }
}



module.exports ={
    validateProductReturn
}