const Products = require("../../model/productmanage");
const Category = require("../../model/category");

const loadProductList = async(req,res)=>{
    try{
      let data = await Products.find({});
      
        
      
        res.render("admin/productlist",{data})

    }
    catch(error){
        console.log(error,"loadProductList page error");
    }
}



const loadEditProductPage = async(req,res)=>{
    try{
        const productID = req.params.id;
        
        const editProduct = await Products.findById(productID);
      
        res.render("admin/editproduct",{editProduct});
        
         
        

    }
    catch(error){
        console.log(error,"loadEditProductPage  page error");
    }
}




const postEditProduct = async (req, res) => {
    try {
       
        const productID = req.params.id;
        
        const data = req.body;
        console.log(data);
        const images = [];
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                images.push(req.files[i].filename);
            }
        }
        
        if(req.files.length > 0){
            console.log("images changed");
            const updatedProduct = await Products.findByIdAndUpdate(productID,
                {name:req.body.name ,
                     specification:req.body.specification,
                     brand:req.body.brand,
                     price:req.body.price,
                     offerprice:req.body.offerprice,
                      quantity:req.body.quantity,
                      category:req.body.category,
                      image:images},
                      {new:true})
        }else{

            console.log("no images are changed");
            const updatedProduct = await Products.findByIdAndUpdate(productID,
                {
                    name:req.body.name ,
                     specification:req.body.specification,
                     brand:req.body.brand,
                     price:req.body.price,
                     offerprice:req.body.offerprice,
                      quantity:req.body.quantity,
                      category:req.body.category
                    },
                      {new:true})
        }
        console.log("product updated");
        res.redirect("/admin/productlist")
       
       

        

       
    } catch (error) {
        console.log(error, 'postEditProduct page error');
    }
};


const deleteProduct = async(req,res)=>{
    try{
        const productID = req.params.id;
        console.log('Deleting product with ID:', productID);
        const deleteProduct = await Products.findByIdAndDelete(productID);
        console.log(deleteProduct);
        res.redirect("/admin/productlist")

    }
    catch(error){
        console.log(error,"deleteProduct error ");
    }
}



module.exports = {
    loadProductList,
    loadEditProductPage,
    postEditProduct,
    deleteProduct
}