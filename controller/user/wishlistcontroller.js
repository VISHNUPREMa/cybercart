const Wishlist = require("../../model/wishlist");
const Products = require("../../model/productmanage");
const Users = require("../../model/userModel");



const getWishList = async(req,res)=>{
    try{
        const wishlistData = await Wishlist.findOne({userID:req.session.user});
        

        res.render("user/wishlist",{user:true,wishlist:wishlistData})

    }
    catch(error){
        console.log(error,"getWishList  page error");
    }
}

const addToWishlist =  async(req,res)=>{
    try{
        const productID = req.body.product;
        const productData = await Products.findById(productID);
        const userId = req.session.user;
       const userData = await Users.findById(userId);
     
       const wishlistData = await Wishlist.findOneAndUpdate(
        {userID:userId},
        {$addToSet:{
            data:{
                productId:productID,
                image:productData.image[0],
                name:productData.name,
                category:productData.category,
                price:productData.offerprice,
                brand:productData.brand,
                units:productData.quantity,
                quantity:1
            }
        }},
        {upsert: true, new: true}
      )

      res.json({status:true})
      


       
        

    }
    catch(error){
        console.log(error,"addToWishlist  page error ");
    }
}


const deleteWishlist = async(req,res)=>{
    try{
        const productId = req.query.id;
        const userid = req.session.user;
        const deleteData = await Wishlist.updateOne(
            { userID: userid },
            { $pull: { data: { productId: productId } } }
        );
        res.redirect("/wishlist");
        
        

    }
    catch(error){
        console.log(error,"deleteWishlist page error");
    }
}



module.exports = {
    getWishList,
    addToWishlist,
    deleteWishlist
}