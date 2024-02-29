const User = require("../../model/userModel");


const loadUserList = async (req, res) => {
    try {

        const page = req.query.page || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;
        const usersCount = await User.countDocuments({});
        totalPages = Math.ceil(usersCount/pageSize);
        const users = await User.find({}).skip(skip).limit(pageSize);
        
        res.render("admin/userlist",{users,totalPages,currentPage:page,userActive:true});
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
