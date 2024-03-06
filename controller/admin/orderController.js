const Orders = require("../../model/orderSchema");
const Users = require("../../model/userModel");
const Address = require("../../model/addressSchema");
const Products = require("../../model/productmanage")
const { ObjectId } = require('mongodb');

const getOrderList = async(req,res)=>{
    try{
        const page = req.query.page || 1;
        const pageSize = 5;
        const skip = (page - 1)*pageSize;
        const ordersCount = await Orders.countDocuments({});
        const totalPages = Math.ceil(ordersCount/pageSize);

        const orderData = await Orders.find({}).skip(skip).limit(pageSize);
        const allUsers = await Users.find({});
        const usersOrderedProduct = allUsers.filter(user => orderData.some(order => order.userid.toString() === user._id.toString()));
        
       
        res.render("admin/order",{order:orderData, user:usersOrderedProduct,totalPages, currentPage: page,orderActive:true});

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
       
        const addressDetails = await Address.findOne({userID:userid})
        const desiredAddress = addressDetails.address.find(address => address._id.toString() === addressId.toString());


        console.log("address : ",desiredAddress);

        

        
  


        res.render("admin/orderdetails",{user:UserDetails,order:orderDetails,address:desiredAddress})

    }
    catch(error){
        console.log(error,"getOrderDetails page error ");
    }
}


const changeOrderStatus = async(req,res)=>{
    try{
        const orderstatus = req.body.selectstatus;
        const products = await Products.find({});

      
        const orderid = req.query.id;
        const validStatuses = ["Cancelled", "Confirmed", "Shipped", "Delivered","Returned"];
        
        
        if(validStatuses.includes(orderstatus)){

           const updatedOrder = await Orders.findByIdAndUpdate(orderid,{$set:{status:orderstatus}});
         
           if(updatedOrder.status === "Cancelled"){
            for(let item of updatedOrder.cart){
                try{
                    const orderedProducts = products.find(prod=>prod._id.toString() === item.id);
                    if(orderedProducts){
                        const updatedQuantity = parseInt(orderedProducts.quantity) + parseInt(item.quantity)
                        await Products.updateOne({_id:item.id},{$set:{quantity:updatedQuantity}});
                        res.redirect("/admin/orderlist");
                    }

                }
                catch(error){
                    console.log("updatedOrder.cart destructure error",error);
                }
            }
            

           }else{
           res.redirect("/admin/orderlist");
           }

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

const getOrderTracking = async(req,res)=>{
    try{
        res.render("admin/ordertracking");

    }
    catch(error){
        console.log("getOrderTracking page error ",error);
    }
}


module.exports = {
    getOrderList,
    getOrderDetails,
    changeOrderStatus,
    deleteOrder,
    getOrderTracking
}