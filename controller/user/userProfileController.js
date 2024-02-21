const Users = require("../../model/userModel");
const Products = require("../../model/productmanage");
const Address = require("../../model/addressSchema");
const Orders = require("../../model/orderSchema");
const Coupons = require("../../model/couponSchema")
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');


const getProfilePage = async(req,res)=>{
    try{
        const id = req.session.user;
        const userDetails = await Users.findById(id);
        const userObjectId = new ObjectId(id)

        const adressData = await Address.findOne({userID:userObjectId});
        const orderDetails = await Orders.find({userid:id});
        
        const  couponData = await Coupons.find({isList:true})
        console.log("Coupons : ",couponData);
        
        res.render("user/profile",{user:userDetails,address:adressData,order:orderDetails,coupons:couponData});

    }
    catch(error){
        console.log(error,"getProfilePage  page error");
    }
}


const getCreateAddressPage = async(req,res)=>{
    try{
       
        
        res.render("user/address",{user:true})

    }
    catch(error){
        console.log(error,"getCreateAddressPage   page error");
    }
}



const postAddressDetails = async (req, res) => {
    try {
        const { address_type, name, housename, landmark, city, state, pincode, phone, altphone } = req.body;
        const id = req.session.user;
        const userObjectId = new ObjectId(id);

      
        let existingAddress = await Address.findOne({ userID: userObjectId });

        if (existingAddress) {
            
            existingAddress.address.push({
                addresstype: address_type,
                name: name,
                housename: housename,
                landmark: landmark,
                city: city,
                state: state,
                pincode: pincode,
                phone: phone,
                altphone: altphone
            });

            
            await existingAddress.save();
            req.session.address = existingAddress;
        } else {
            
            const newAddress = await Address.create({
                userID: userObjectId,
                address: [{
                    addresstype: address_type,
                    name: name,
                    housename: housename,
                    landmark: landmark,
                    city: city,
                    state: state,
                    pincode: pincode,
                    phone: phone,
                    altphone: altphone
                }]
            });

            req.session.address = newAddress;
        }

        res.redirect("/profile");
    } catch (error) {
        console.log(error, "postAddressDetails page error");
    }
}



const getEditAddressPage = async(req,res)=>{
    try{
        
        const id = req.query.id;
        console.log("id : ",id);
        const addressDetails = await Address.findOne({userID:req.session.user});
       
        const address = addressDetails.address.find(addr => addr._id.toString() === id);
  
       
        
        
        res.render("user/editaddress",{address:address})
        
        

    }
    catch(error){
        console.log(error,"getEditAddressPage   page error");
    }
}


const postEditAdress = async(req,res)=>{
    try{
        const id = req.params.id;
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

const postEditPassword = async(req,res)=>{
    try{
        const{currentpassword ,newpassword ,confirmPassword,name,mobile  } = req.body;
        
    
       const userid = req.session.user;
       const user = await Users.findById(userid);
        if(newpassword !== confirmPassword){
            return res.status(400).json({ status: false, message: "Passwords do not match" });

        }else if(!await bcrypt.compare(currentpassword,user.password) ){

            return res.status(400).json({ status: false, message: "your current password is wrong" });
        }else if(!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(newpassword)){
            return res.status(400).json({ status: false, message: "Need strong password" });
        }else{
            const newHashedPassword = await bcrypt.hash(newpassword, 6);
            if(newHashedPassword){
                const updatePassword = await Users.updateOne({_id:userid},
                    {$set:{password:newHashedPassword,name:name,mobile:mobile}}
                    
                    )

                    if(updatePassword){
                        return res.status(200).json({ status: true, message: "Details changed successfully !!!" });
                    }
            }
        }

    }
    catch(error){
        console.log(error,"postEditPassword page error");
    }
}








module.exports = {
    getProfilePage,
    getCreateAddressPage,
    postAddressDetails,
    getEditAddressPage,
    postEditAdress,
    postEditPassword
    
}