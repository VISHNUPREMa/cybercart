
const Wallet = require("../../model/walletSchema")
const razorPay = require("razorpay");
const moment = require('moment-timezone');
const {RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET} = process.env;



const razorpayInstance = new razorPay({
    key_id:RAZORPAY_KEY_ID,
    key_secret:RAZORPAY_KEY_SECRET
})


const addMoneyToWallet = async(req,res)=>{
    try{
        const amount = req.body.amount;
        console.log("amount : ",amount);
        const userid = req.session.user;
        data={
            amount :Number(amount),
            createdOn :moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
            source:"online"
        }

         const walletData = await Wallet.findOne({userId : userid});

         if(walletData){
            await Wallet.updateOne(
                {userId : userid},
                {$push:{data:data}}
            )
            
         }else{
            await Wallet.create({userId : userid,data:data})
         }

        const options = {
            amount: amount * 100, 
            currency: 'INR',
            
           
        };

        razorpayInstance.orders.create(options, async function (err, order) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to create Razorpay order" });
                return;
            }else{
               
                

            console.log("order : ",order);
            res.json({ payment:false,method:"UPI",order:order});
            }
        
    
        });


        
    }
    catch(error){
        console.log(error,"addMoneyToWallet page error ");
    }
}




module.exports = {
    addMoneyToWallet
}