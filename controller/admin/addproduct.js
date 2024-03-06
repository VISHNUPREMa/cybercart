
const multer = require('multer');
const Products = require("../../model/productmanage");
const Category = require("../../model/category");
const moment = require('moment-timezone');






const loadAddProduct = async(req,res)=>{
    try{

        const categories = await Category.find();
        res.render("admin/addproduct", { cat:categories ,addproductActive:true });


    }
    catch(error){
        console.log(error,"loadAddProduct page error");
    }
}



const addProduct = async (req, res) => {
    try {
        const productData = req.body;
      
        const images = req.files ? req.files.map(file => file.filename) : [];

      

        const newProduct = new Products({
            name: productData.name,
            brand: productData.brand,
            specification: productData.specification,
            category: productData.category,
            price: productData.price,
            offerprice: productData.offerprice,
            quantity: productData.quantity,
            image: images,
            createdon:moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
           

        });

        const newData = await newProduct.save();
       
        res.redirect("/admin/addproduct");

    } catch (error) {
        console.error("Error adding product:", error);
        
        
    }
};







module.exports = {
    loadAddProduct,
    addProduct
}