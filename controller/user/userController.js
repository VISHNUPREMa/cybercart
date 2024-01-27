const User = require("../../model/userModel");
const { generateRandomOtp } = require("../helper/otpGenerate");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const {sendOtpEmail} = require("../helper/emailService");





const getHomePage = async(req,res)=>{
    try{
        res.render("user/home")

    }
    catch(error){
        console.log(error);
    }
}

const loadlogIn = async(req,res)=>{
    try{
        
            res.render("user/login")
        

    }
    catch(error){
        console.log(error);
    }
}




const loadSignIn = async(req,res)=>{
    try{
        res.render("user/signup")
    }
    catch(error){
        console.log(error);
    }
}

const signInUser = async (req, res) => {
    try {
        
      const{username,email,mobile,password} = req.body;
     
  
      
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.render("user/signup", { message: "User already exists" });
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


        
        
        res.redirect("/verifyotp");

      }
    } catch (error) {
      console.log(error);
      res.render("user/signup", { message: "Registration Failed" });
    }
  }

  const loadOtpPage = async(req,res)=>{
    try{

        res.render("user/otp")
       

    }
    catch(error){
        console.log(error);
    }
  }

  const otpPage = async (req, res) => {
    try {
      const userEnteredOtp = req.body.otp;
      const storedOtp = req.session.tempUser.otp;
  
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

  const logIn = async(req,res)=>{
    try{
        const {email,password} = req.body;
        

        const existingUser = await User.findOne({email:email});
        
        if(!existingUser){
            res.render("user/login",{message: "user not found"})
        }else{      
        
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        
        
        
                if(isPasswordMatch){
                    req.session.user = existingUser;
                    res.redirect("/");
                }else{
                    res.render("user/login",{message:"Invalid Password"})
                }}

  

       
    }
    catch(error){
        console.log(error);
    }
}


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
        const {email , password , confirmpassword} = req.body;
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

            req.session.tempUser.password = password;
            req.session.tempUser.email = email;
            req.session.tempUser.otp = otp;
            
           
            
            
          
               
            res.render("user/otpPasswordVerify");

            
        }else{
            res.render("user/forgetpassword",{message: "user not found"})
        }


    }
    catch(error){
        console.log(error);
    }
}

const otpVerifyPasswordReset = async(req,res)=>{
   
    try{
        const userEnteredOtp = req.body.otp;
        const storedOtp = req.session.tempUser.otp;
        const newHashedPassword = await bcrypt.hash(req.session.tempUser.password , 6)
       
        if(userEnteredOtp === storedOtp){
            const updateUser = await User.updateOne({email:req.session.tempUser.email } , 
                {$set: {password:newHashedPassword}});
                res.redirect("/login")

                
        }else{
            res.render("user/otpPasswordVerify",{message:"OTP mismatch try again"})
        }
        


    }
    catch(error){
        console.log(error,"otpVerifyPasswordReset  page  error ");

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
otpVerifyPasswordReset

}