const User = require("../../model/userModel");
const Category = require("../../model/category");
const Products = require("../../model/productmanage");
const Offers = require("../../model/offerSchema")

const { generateRandomOtp } = require("../../helper/otpGenerate");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const {sendOtpEmail} = require("../../helper/emailService");





const getHomePage = async(req,res)=>{
    try{
        const user = req.session.user;
       
           
        
        
        const userData = await User.find({isBlocked:false});
        const categoryData = await Category.find({isList:true});
        
        const productData = await Products.find({isListed:true})
        const cartData = req.session.cartData;
        const cartTotal = req.session.grandTotal;

        const offerData = await Offers.find({});
    

        
        
        
        if(user){
            res.render("user/home",{user:user,category:categoryData,products:productData});

        }else{
            res.render("user/home");
        }

        

    }
    catch(error){
        console.log(error);
    }
}



const loadlogIn = async(req,res)=>{
    try{
        if(!req.session.user){
            res.render("user/login");
        }else{
            res.redirect("/");
        }
         }
    catch(error){
        console.log(error);
    }
}




const loadSignIn = async(req,res)=>{
    try{
        res.render("user/signup");
    }
    catch(error){
        console.log(error);
    }
}

const signInUser = async (req, res) => {
    try {
        
      const{username,email,mobile,password} = req.body;
      console.log([username,email,mobile,password]);
      
     
  
      
      
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
        console.log([username,email,mobile,password]);


        
        
        res.status(200).json({ redirectUrl: "/verifyotp" });
        console.log("testing");

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
        console.log(error);
    }
  }


  const resendOtp = async (req, res) => {
    try {
       
        delete req.session.tempUser.otp;

        const emailForResend = req.session.tempUser.email; 
        
        const newOtp = generateRandomOtp();
       

       
        await sendOtpEmail(emailForResend, newOtp);

        req.session.tempUser.otp = newOtp;
        res.redirect("/verifyotp");
       
        

        

       
    } catch (error) {
        console.error('Error:', error);
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
        
        res.redirect("/login");
      } else {
        
        res.render("user/otp", { message: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
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
          
                res.render("user/passwordreset")

                
        }else{
            res.render("user/otpPasswordVerify",{message:"OTP mismatch try again"})
        }
        


    }
    catch(error){
        console.log(error,"otpVerifyPasswordReset  page  error ");

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

        
       res.render("user/otpPasswordVerify");
      
    
        
      


    }
    catch(error){
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
loadOtpPageForPassword



}