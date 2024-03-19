const User = require("../../model/userModel");
const Category = require("../../model/category");
const Products = require("../../model/productmanage");
const Offers = require("../../model/offerSchema");
const Orders = require("../../model/orderSchema");
const Referal = require("../../model/referalSchema");
const Wallet = require("../../model/walletSchema");
const Message = require("../../model/messageSchema");

const { generateRandomOtp } = require("../../helper/otpGenerate");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const {sendOtpEmail} = require("../../helper/emailService");
let referralCodeGenerator = require('referral-code-generator');
const moment = require("moment-timezone")
// const { default: orders } = require("razorpay/dist/types/orders");





const getHomePage = async(req,res)=>{
    try{
        const page = req.query.page || 1;
        const pageSize = 6;
        const skip = (page - 1)*pageSize;
        const user = req.session.user;
        const allProductsCount = await Products.countDocuments({});
        const totalPages = Math.ceil(allProductsCount/pageSize);
       
           
        
        
        const userData = await User.find({isBlocked:false});
        const categoryData = await Category.find({isList:true});
        
        const productData = await Products.find({isListed:true}).skip(skip).limit(pageSize);
        const newproductData = await Products.find({isListed:true})
        const cartData = req.session.cartData;
        const cartTotal = req.session.grandTotal;

        const offerData = await Offers.find({});
        const orders = await Orders.find({ status: { $ne: "Cancelled" } });
        
      


let productsCount = {};


orders.forEach(order => {
    order.products.forEach(product => {
   
        if (!productsCount[product.name]) {
           
            productsCount[product.name] = 1;
        } else {
           
            productsCount[product.name]++;
        }
    });
});



        


const productsSorted = Object.entries(productsCount)
    .sort(([, countA], [, countB]) => countB - countA) 
    .map(([productName]) => productName); 



const sortedProductsData = newproductData.filter(product => productsSorted.includes(product.name));


sortedProductsData.sort((a, b) => {
    const countA = productsCount[a.name];
    const countB = productsCount[b.name];
    

    if (countA === countB) {
        return b.quantity - a.quantity;
    }

 
    return countB - countA;
});



const bestSellingBrands = [...new Set(sortedProductsData.map(product => product.brand))];

const sortedByBrands = (a,b)=>{
    const indexA = bestSellingBrands.indexOf(a.brand);
  const indexB = bestSellingBrands.indexOf(b.brand);
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  
  
  if (indexA !== -1) {
    return -1;
  }
  if (indexB !== -1) {
    return 1;
  }
  

  return 0;
}

const sortedProductsByBrands = newproductData.sort(sortedByBrands).slice(0, 8);






    

        
        
        
        if(user){
            res.render("user/home",{user:user,category:categoryData,products:productData,bestproduct:sortedProductsData,bestbrands:sortedProductsByBrands,totalPages:totalPages,currentPage: page,offer:offerData});

        }else{
            res.render("user/home",{products:newproductData,category:categoryData});
        }

        

    }
    catch(error){
        console.log("getHomePage page error : ",error);
    }
}



const loadlogIn = async(req,res)=>{
    try{
        if(!req.session.user){
            const successMessage = req.session.successMessage;
            // Clear success message from session
            req.session.successMessage = null;

            res.render("user/login",{successMessage});
        }else{
            res.redirect("/");
        }
         }
    catch(error){
        console.log("login page error : ",error);
    }
}




const loadSignIn = async(req,res)=>{
    try{
        res.render("user/signup");
    }
    catch(error){
        console.log("loadSignIn page error : ",error);
    }
}

const signInUser = async (req, res) => {
    try {
        
        const { formData } = req.body;
        const { username, email, mobile, password, referal } = formData;
    
          

      if(referal){
        const referalData = await Referal.findOne({code:referal});
       const referedUserWallet = await Wallet.findOne({userId:referalData.owner});
        
        

    if (referedUserWallet) {
        const newTransaction = {
            amount: Number(500),
            createdOn: moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
            source: "Referal Income"
        };
    
        await Wallet.updateOne(
            { _id: referedUserWallet._id }, // Assuming _id is the identifier for the wallet
            { $push: { data: newTransaction } }
        );
    
        
    }
    

      }
      
      
       
          
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(200).json({ success: true, message: "user already exist" });
      } else {
        
        const hashedPassword = await bcrypt.hash(password, 6);
        const otp = generateRandomOtp();
       


        
        req.session.tempUser = {
            username,
            email,
            mobile,
            password:hashedPassword,
            otp
        }


        await sendOtpEmail(email, otp);
        


        
        
        res.status(200).json({ redirectUrl: "/verifyotp" });
       

      }
    } catch (error) {
      console.log(error);
      res.render("user/signup", { message: "Registration Failed" });
    }
  }

  const loadOtpPage = async(req,res)=>{
    try{

        res.render("user/otp")
        console.log(req.session.tempUser.otp);
       

    }
    catch(error){
        console.log( "loadOtpPage page error : ",error);
        
    }
  }


  const resendOtp = async (req, res) => {
    try {
       
        delete req.session.tempUser.otp;

        const emailForResend = req.session.tempUser.email; 
        
        const newOtp = generateRandomOtp();
       

       
        await sendOtpEmail(emailForResend, newOtp);

        req.session.tempUser.otp = newOtp;
        console.log(req.session.tempUser.otp);
        res.status(200).json({message:"success"})
        
       
        

        

       
    } catch (error) {
        console.error('loadOtpPage Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};




  const otpPage = async (req, res) => {
    try {
      const userEnteredOtp = req.body.otp;
      const storedOtp = req.session.tempUser.otp;
      console.log(storedOtp);
  
      if (userEnteredOtp === storedOtp) {
        const userData = {
            name: req.session.tempUser.username,
            email: req.session.tempUser.email,
            mobile: req.session.tempUser.mobile,
            password: req.session.tempUser.password,
        }
        const newUser = await User.create(userData);
        let myReferalCode = referralCodeGenerator.custom('lowercase', 6, 6, 'cybercart');
        console.log("my referal code : ",myReferalCode);
        const referalData = await Referal.create({
            owner:newUser._id,
            code:myReferalCode,

        })

        
       

        req.session.successMessage = "Signup successful. Please login with your credentials.";
        res.status(200).json({message:"success"})
        
        // res.redirect("/login");
      } else {

        res.status(200).json({message:"Invalid otp"})
        
        // res.render("user/otp", { message: "Invalid OTP" });
      }
    } catch ( error) {
      console.log("loadOtpPage page erro",error);
    }
  };


  








  
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.render("user/login", { message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      

        if (isPasswordMatch) {
            if (existingUser.isBlocked) {
                return res.render("user/login", { message: "User is blocked" });
            }

            
            req.session.user = existingUser.id;
            
         

        
            return res.redirect("/");
        } else {
            return res.render("user/login", { message: "Invalid password" });
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).send("Internal Server Error");
    }
};




const forgetPasswordLoad = async(req,res)=>{
    try{
        res.render("user/forgetpassword")

    }
    catch(error){
        console.log(error);
    }
}

const forgetpassword = async(req,res)=>{
    try{
        const email  = req.body.email;
        const existUser = await User.findOne({email:email});
        if(existUser){
            const otp = generateRandomOtp();
            await sendOtpEmail(email, otp);
            console.log(otp);
     
            if(!req.session){
                req.session = {}
            }
            if(!req.session.tempUser){
                req.session.tempUser = {}
            }

            req.session.tempUser.email = email;
            req.session.tempUser.otp = otp;
            
           
            
            res.status(200).json({redirect:"/forgetpassword/otppage"});
          
               
      

            
        }else{
            res.status(400).json({message: "user not found"})
            
        }


    }
    catch(error){
        console.log(error);
    }
}

const loadOtpPageForPassword = async(req,res)=>{
    try{
        res.render("user/otpPasswordVerify")
    }
    catch(error){
        console.log(error);
    }
}

const otpVerifyPasswordReset = async(req,res)=>{
   
    try{
        const userEnteredOtp = req.body.otp;
        
        const storedOtp = req.session.tempUser.otp || req.session.newOtp ;
       
       
        if(userEnteredOtp === storedOtp){
          
                res.status(200).json({message:"Otp Validate Successfully !!!"})

                
        }else{
            res.status(200).json({message:"Ivalid otp"})
        }
        


    }
    catch(error){
        console.log(error,"otpVerifyPasswordReset  page  error ");

    }
}


const newPasswordVerify = async(req,res)=>{
    try{
        res.render("user/passwordreset")

    }catch(error){
        console.log("newPasswordVerify page error",error);

    }
}






const resndOtpForForgetpassword = async(req,res)=>{
    try{
         req.session.tempUser.email;
        
       
        

 
        delete req.session.tempUser.otp;

        const newOtp = generateRandomOtp();
        await sendOtpEmail(req.session.tempUser.email, newOtp);
        req.session.newOtp = newOtp;
        console.log(req.session.newOtp );

     

        
       res.status(200).json({message:"success"})
      
    
        
      


    }
    catch(error){
        res.status(500).json({message:"error on otp resend"})
        console.log(error,"resndOtpForForgetpassword page error");
    }
}


const newPasswordReset = async(req,res)=>{
    try{
        const {password} = req.body;
        console.log(password);
        console.log("email : ",req.session.tempUser.email);
        req.session.tempUser.password = password;

        if (!req.session.tempUser.password) {
            console.log("Password not provided");
            return res.status(400).send("Password not provided");
        } 

        const newHashedPassword = await bcrypt.hash(req.session.tempUser.password, 6);

        if(newHashedPassword){
            const updateUser = await User.updateOne({email:req.session.tempUser.email } , 
                {$set: {password:newHashedPassword}})
                .then(data=>console.log(data))
                res.redirect("/login")
        }else{
            console.log("password not hashed");
        }

    }
    catch(error){
        console.log(error,"newPasswordReset   page error");
    }
}










const logoutUser = async(req,res)=>{
    try{
        req.session.destroy((error)=>{
            if(error){
                console.log(error,"  error in log out");
            }else{
                res.render("user/login");
            }

        })

    }catch(error){

    }
}




const laodShopPage = async(req,res)=>{
    try{
        const user = req.session.user;
       
           
        
        
        const userData = await User.find({isBlocked:false});
        const categoryData = await Category.find({isList:true});
        
        const productData = await Products.find({isListed:true})
        res.render("user/shop",{user:user,category:categoryData,products:productData})

    }
    catch(error){
        console.log(error,"laodShopPage page error");
    }
}


const loadAboutPage = async(req,res)=>{
    try {
        res.render("user/about",{user:true})
        
    } catch (error) {
        
    }
}


const loadContactPage = async(req,res)=>{
    
 try {
    res.render("user/contact",{user:true})
    
 } catch (error) {
    
 }

}


const postQueries = async(req,res)=>{
    try {
        const{name,email,phone,subject,message} = req.body;
        console.log([name,email,phone,subject,message]);
        const messageData = await Message.create({
            name:name,
            email:email,
            phone:phone,
            subject:subject,
            message:message,
            messagedat:moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
        })

        console.log("messageData : ",messageData);
        if(messageData){
            res.status(200).json({message:"Message sent sucessfully !!!"})
        }

        
    } catch (error) {
        
    }
}







  


module.exports = {
    getHomePage,
    loadlogIn,
loadSignIn,
logIn,
signInUser,
loadOtpPage,
otpPage,
forgetPasswordLoad,
forgetpassword,
otpVerifyPasswordReset,
resendOtp , 
logoutUser,
resndOtpForForgetpassword,
laodShopPage,
newPasswordReset,
loadOtpPageForPassword,
newPasswordVerify,
loadAboutPage,
loadContactPage,
postQueries




}
