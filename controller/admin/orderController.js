const Orders = require("../../model/orderSchema");
const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema")
const { ObjectId } = require('mongodb');

const getOrderList = async(req,res)=>{
    try{
        const orderData = await Orders.find({});
        const allUsers = await Users.find({});
        const usersOrderedProduct = allUsers.filter(user => orderData.some(order => order.userid.toString() === user._id.toString()));
        
       
        res.render("admin/order",{order:orderData, user:usersOrderedProduct});

        }
    catch(error){
        console.log(error,"getOrderList  page error");
    }
}


const getOrderDetails = async(req,res)=>{
    try{
        const userid = req.query.user;
        const orderid = req.query.order;
        const UserDetails = await Users.findById(userid);
        const orderDetails = await Orders.findById(orderid);
        const addressId = orderDetails.address[0]._id;
        const addressDetails = await Address.findById(addressId);

        res.render("admin/orderdetails",{user:UserDetails,order:orderDetails,address:addressDetails})

    }
    catch(error){
        console.log(error,"getOrderDetails page error ");
    }
}


const changeOrderStatus = async(req,res)=>{
    try{
        const orderstatus = req.body.selectstatus;
        const orderid = req.query.id;
        const validStatuses = ["Awaiting payment", "Confirmed", "Shipped", "Delivered"];
        
        
        if(validStatuses.includes(orderstatus)){

           const updatedOrder = await Orders.findByIdAndUpdate(orderid,{$set:{status:orderstatus}});
           res.redirect("/admin/orderlist")

        }

    }
    catch(error){
        console.log(error,"changeOrderStatus page error");
    }
}


const deleteOrder = async(req,res)=>{
    try{
        const orderid = req.query.order;
        const order = await Orders.findByIdAndDelete(orderid);
        res.redirect("/admin/orderlist")
        

    }
    catch(error){
        console.log(error,"deleteOrder  page error ");
    }
}


module.exports = {
    getOrderList,
    getOrderDetails,
    changeOrderStatus,
    deleteOrder
}