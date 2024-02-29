const Category = require("../../model/category");

const loadCategoryPage = async(req,res)=>{
    try{
        const categories = await Category.find(); 
        res.render("admin/category", { categories,errorMessage: "" ,categoryActive:true});


    }
    catch(error){
        console.log(error,"loadCategoryPage  error");
    }
}




const categoryDetailsPost = async (req, res) => {
    try {
        const { categoryName, description } = req.body;
        const alphabet = /^[A-Za-z]+$/;
        const categories = await Category.find();
        const existingCategory = await Category.findOne({ name: {$regex: categoryName, $options: 'i'}});
        

        if(description){
            if (!alphabet.test(categoryName)) {
                res.render("admin/category", { categories, errorMessage: "Category name is required and must be alphabetic" });
            } else if (!existingCategory ) {
                await Category.create({ name: categoryName, description: description });
                res.redirect("/admin/category");
            } else {
                res.render("admin/category", { categories, errorMessage: "Category already exists" });
            }
        }else{
            res.render("admin/category", { categories, errorMessage: "Description required " });
        }


      
    } catch (error) {
        console.log(error, "categoryDetailsPost");
    }
};





const unlistCategory = async(req,res)=>{
    try{
        const categoryID = req.params.id;
        const editCategory = await Category.findByIdAndUpdate(categoryID,{isList:false});
        
        res.redirect("/admin/category");

    }catch(error){
        console.log(error,"unlistCategory page error");
    }
}

const listCategory = async(req,res)=>{
    try{
        const categoryID = req.params.id;
        const editCategory = await Category.findByIdAndUpdate(categoryID,{isList:true});
       
        res.redirect("/admin/category");

    }catch(error){
        console.log(error,"unlistCategory page error");
    }
}


const loadEditCategory = async(req,res)=>{
    try{
        const categoryID = req.params.id;
        const editCategories = await Category.findById(categoryID);
        res.render("admin/categoryedit",{editCategories})
        


    }
    catch(error){
        console.log(error,"loadEditCategory   page  error");
    }
}



const postEditCategory = async(req,res)=>{
    try{
        const categoryID = req.params.id;
        const {name,brand,description} = req.body;
        const categories = await Category.find();

   
        const existingCategory = await Category.findOne({ name: {$regex: name, $options: 'i'}});
        if (existingCategory && String(existingCategory._id) !== String(categoryID)) {
      
            res.render("admin/category", {categories, errorMessage: "Category already exists" });
        } else {
           
            await Category.findByIdAndUpdate(categoryID,{name,brand,description});
            res.redirect("/admin/category");
        }
    }
    catch(error){
        console.log(error,"postEditCategory  page edit");
    }
}





module.exports = {
    loadCategoryPage ,
    categoryDetailsPost,
    unlistCategory,
    listCategory,
    loadEditCategory,
    postEditCategory
}