const User = require("../../model/userModel");
const Admin = require("../../model/category");
const bcrypt = require("bcrypt");


const getAdminHomePage = async(req,res)=>{
    try{
        if(req.session.admin){
            res.redirect("/admin/dashboard");

        }else{
            res.render("admin/adminlogin");
        }

    }
    catch(error){
        console.log(error,"admin home page cannot render");
    }
}



const adminHomePagePost = async (req, res) => {
    try {
        const{email,password} = req.body;
        const isAdmin = await User.findOne({email:email,isAdmin:1});
        req.session.admin = isAdmin._id;
        
        
        if(isAdmin){
            const validatePassword = await bcrypt.compare(password,isAdmin.password);
            if(validatePassword){
                res.redirect("admin/dashboard");

            }else{
                res.render("admin/adminlogin",{message:"password mismatch"})
            }
        }else{
            res.render("admin/adminlogin",{message:"Admin details not found"})
        }
        
       

    } catch (error) {
        console.log(error, "adminHomePagePost  page error");
    }
}


const loadDashboardHome = async(req,res)=>{
    try{
       
        res.render("admin/admindashboard");

    }
    catch(error){
        console.log(error,"loadDashboardHome   page error");
    }
}

const logoutAdmin = async(req,res)=>{
    try{
        req.session.admin = null;
        res.redirect("/admin")
        
        


    }
    catch(error){
        console.log(error,"logoutAdmin page error");
    }
}





module.exports = {
    getAdminHomePage,
    adminHomePagePost,
    loadDashboardHome,
    logoutAdmin
    
   };










