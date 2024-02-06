const User = require("../../model/userModel");


const loadUserList = async (req, res) => {
    try {
        const users = await User.find({});
        
        res.render("admin/userlist",{users});
    } catch (error) {
        console.log(error, "loadUserList error");
        res.status(500).send("Internal Server Error");
    }
};


const blockUser = async(req,res)=>{
    try{
        const userId = req.params.id;
        const Block = await User.findByIdAndUpdate(userId,{isBlocked:true});
       
        res.redirect("/admin/userlist");
     
        

    }
    catch(error){
        console.log(error,"enderUserList  page error");
    }
}

const unBlockUser = async(req,res)=>{
    try{
        const userId = req.params.id;
        const unBlock = await User.findByIdAndUpdate(userId,{isBlocked:false});
        
        res.redirect("/admin/userlist")
     
        

    }
    catch(error){
        console.log(error,"enderUserList  page error");
    }
}




module.exports = {
    loadUserList ,
    blockUser ,
    unBlockUser
}
