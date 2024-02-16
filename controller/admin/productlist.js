const Products = require("../../model/productmanage");
const Category = require("../../model/category");

const loadProductList = async(req,res)=>{
    try{

        const page = req.query.page || 1;
        const pageSize = 3;
        const skip = (page - 1)* pageSize;
        const productsCount = await Products.countDocuments({});
        const totalpage = Math.ceil(productsCount/pageSize);
      let data = await Products.find({}).skip(skip).limit(pageSize);

      
        
      
        res.render("admin/productlist",{data,totalpage,currentPage: page})

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
                     brand:req.body.editbrand,
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
        
        

       
        const product = await Products.findById(productID);

        product.isListed = !product.isListed;
        
        // Save the updated product
        await product.save();

        console.log('Product listing status updated:', product);
        
        // Redirect back to the product list page
        res.redirect("/admin/productlist");
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