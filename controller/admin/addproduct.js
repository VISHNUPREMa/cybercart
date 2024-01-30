const Products = require("../../model/productmanage");
const Category = require("../../model/category");


const loadAddProduct = async(req,res)=>{
    try{

        const categories = await Category.find();
        res.render("admin/addproduct", { categories });


    }
    catch(error){
        console.log(error,"loadAddProduct page error");
    }
}





module.exports = {
    loadAddProduct
}