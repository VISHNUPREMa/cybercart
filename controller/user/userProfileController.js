const Users = require("../../model/userModel");
const Products = require("../../model/productmanage");


const getProfilePage = async(req,res)=>{
    try{
        const userID = req.session.user;
        const userDetails = await Users.findById(userID);
        res.render("user/profile",{user:userDetails});

    }
    catch(error){
        console.log(error,"getProfilePage  page error");
    }
}

const getCreateAddressPage = async(req,res)=>{
    try{
        res.render("user/address")

    }
    catch(error){
        console.log(error,"getCreateAddressPage   page error");
    }
}


module.exports = {
    getProfilePage,
    getCreateAddressPage
}