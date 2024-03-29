const Users = require("../../model/userModel");
const Products = require("../../model/productmanage");

const { ObjectId } = require('mongodb');





const addToCart = async(req,res)=>{
    try{
          const { id: productID, quantity, availability } = req.body;
          const userID = req.session.user;
         parseInt(quantity, availability);
          
          const userDetails = await Users.findById(userID);

          const productDetails = await Products.findById(productID);
          
          
        if (!userDetails) {
            return res.json({ status: false, message: "User not found" });
        }

          if(productDetails.quantity > 0){
            IndexOfProduct = userDetails.cart.findIndex(item=>item.id === productID);


            if(IndexOfProduct == -1){
                await Users.findByIdAndUpdate(userID,
                    {$addToSet:{
                        cart:{
                            id:productID,
                            quantity:quantity
                        }
                    }})
                    .then((data)=>{

                    
                        res.json({ status: true, message: "Product added to cart successfully" });

                    })
                   


            }else{
                const productAlreadyInCart = userDetails.cart[IndexOfProduct];
                if(productAlreadyInCart.quantity <= availability){
                    const updatedQuantity = parseInt(productAlreadyInCart.quantity) + parseInt(quantity);
                    const updatedAvailability = parseInt(availability) - parseInt(quantity);
        
                 
                    if(updatedAvailability > 0){
                        await Users.updateOne(
                            {_id:userID, "cart.id":productID},
                            {$set:{"cart.$.quantity":updatedQuantity}}
                        );

    
                       
                        res.status(200).json({status:true});
                    }else{
                        res.status(404).json({ status: false, message: "Out of stock " });
                    }
                }else{
                    res.status(500).json({ status: false, message: "product quantity exceed" });

                }


            }
          }else{
            res.status(404).json({ status: false, message: "Out of stock" });
          } 

    }
    catch(error){
        console.log(error,"addToCart  ");
    }
}

const loadCartPage = async (req, res) => {
    try {

        const userID = req.session.user;
        const userObjectId = new ObjectId(userID);
        const userData = await Users.findById(userID);
        const productIDs = userData.cart.map(item=>item.id);
        const products = await Products.find({
            _id: { $in: productIDs },
            isListed: true 
        });
        
        let data = await Users.aggregate([
            { $match: { _id: userObjectId } },
            { $unwind: "$cart" },
            { $project: { proID: { "$toObjectId": "$cart.id" }, quantity: "$cart.quantity" } },
            {
                $lookup: {
                    from: "products",
                    localField: "proID",
                    foreignField: "_id",
                    as: "matchedProductDetails"
                }
            },
           
            { $match: { "matchedProductDetails.isListed": true } }
        ]);
 


       
        let quantity = 0
        for (let i of userData.cart) {
            quantity += i.quantity
        }

        let eachTotal = 0;
        let grandTotal =0;
        for(let i=0;i<data.length;i++){
           
            eachTotal = data[i].matchedProductDetails[0].offerprice *data[i].quantity;
             grandTotal += eachTotal;
           
         
       
       
        }
        req.session.cartData = data;

        req.session.grandTotal = grandTotal;
       
       
         res.render("user/cart",{user:true,data,grandTotal})
       


        
       
    } catch (error) {
        console.log(error, "loadCartPage error");
        res.status(500).send("Internal Server Error");
    }
};










const deleteItem = async(req,res)=>{
    try{
        const productID = req.query.id;
        const userID = req.session.user;
        const userDetails = await Users.findById(userID);
        const cartIndex = userDetails.cart.findIndex(item=>item.id === productID);
        userDetails.cart.splice(cartIndex,1);
        await userDetails.save();
        res.redirect("/cart");


    }
    catch(error){
        console.log(error,"deleteItem page error");
    }
}


const updateQuantity = async(req,res)=>{
    try{
        let availability;
        const {productId,quantity,count} = req.body;
        
        req.session.productId = productId;
        req.session.quantity = quantity;
        
        const id = req.session.user;
        const userData = await Users.findById(id);
        const productData = await Products.findById(productId);

  

       
        
      
        
        if(userData){
            const productInCart = userData.cart.find(item=> item.id === productId);
            
            if(productInCart){
               const quantityUpdate = await Users.updateOne(
                {_id:id,"cart.id":productId},
                {$set:{"cart.$.quantity":quantity}}
               )

               

               

               
            }
        }
       

        
    
      
        

    }
    catch(error){
        console.log(error,"updateQuantity page error");
    }
}








module.exports = { loadCartPage, addToCart,deleteItem,updateQuantity}