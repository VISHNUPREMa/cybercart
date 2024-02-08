const Users = require("../../model/userModel");
const Products = require("../../model/productmanage");
const Address = require("../../model/addressSchema");
const Orders = require("../../model/orderSchema");
const { ObjectId } = require('mongodb');


const getProfilePage = async(req,res)=>{
    try{
        const id = req.session.user;
        const userDetails = await Users.findById(id);
        const userObjectId = new ObjectId(id)

        const adressData = await Address.findOne({userID:userObjectId});
        const orderDetails = await Orders.find({userid:id});
        
        res.render("user/profile",{user:userDetails,address:adressData,order:orderDetails});

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


const postAddressDetails = async(req,res)=>{
    try{
        const {address_type,name,housename,landmark,city,state,pincode,phone,altphone} = req.body;
       
     const id = req.session.user;
     const userObjectId = new ObjectId(id)
     const addressData = await Address.create({
        userID:userObjectId,
        address:[{
            addresstype:address_type,
            name:name,
        housename:housename,
        landmark:landmark,
        city:city,
        state:state,
        pincode:pincode,
        phone:phone,
        altphone:altphone
        }]


     });

     req.session.address = addressData;
     res.redirect("/profile");


   
        }
    catch(error){
        console.log(error,"postAddressDetails  page error");
    }
}


const getEditAddressPage = async(req,res)=>{
    try{
        const id = req.query.id;
        const addressData = await Address.findOne({"address._id":id});
        res.render("user/editaddress",{address:addressData})
        
        

    }
    catch(error){
        console.log(error,"getEditAddressPage   page error");
    }
}


const postEditAdress = async(req,res)=>{
    try{
         const id = req.query.id;
         const {name,housename,landmark,city,state,pincode,phone,altphone} = req.body;
        const updatedAddress = await Address.updateOne({"address._id":id},{$set:{
            
            "address.$.name": name,
            "address.$.housename": housename,
            "address.$.landmark": landmark,
            "address.$.city": city,
            "address.$.state": state,
            "address.$.pincode": pincode,
            "address.$.phone": phone,
            "address.$.altphone": altphone,
        }})

        res.redirect("/profile")

    }
    catch(error){
        console.log(error,"postEditAdress  page error");
    }
}


module.exports = {
    getProfilePage,
    getCreateAddressPage,
    postAddressDetails,
    getEditAddressPage,
    postEditAdress
}