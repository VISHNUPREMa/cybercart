const Users = require("../../model/userModel");
const Products = require("../../model/productmanage");
const Category = require("../../model/category")


const categorySort = async(req,res)=>{
    try{

        const category = req.query.category;
        console.log("category : ",category);
        const userid = req.session.user;
        const products = await Products.find({category:category});
        
            res.render("user/categorysort",{user:userid,category:category,products:products});


    }
    catch(error){
        console.log(error, "category sort page error");
    }
}



const lowToHigh =  async(req,res)=>{
    try{
        
       
        const userid = req.session.user;
        const products = await Products.find({}).sort({offerprice: 1});
        const categoryData = await Category.find({isList:true});
        
            res.render("user/categorysort",{user:userid,category:categoryData,products:products});


    }
    catch(error){
        console.log(error,"lowToHigh page error");
    }
}

const HighToLow =  async(req,res)=>{
    try{
        
       
        const userid = req.session.user;
        const products = await Products.find({}).sort({offerprice: -1});
        const categoryData = await Category.find({isList:true});
       
            res.render("user/categorysort",{user:userid,category:categoryData,products:products});


    }
    catch(error){
        console.log(error,"lowToHigh page error");
    }
}

const AtoZ =  async(req,res)=>{
    try{
        
       
        const userid = req.session.user;
        const products = await Products.find({}).sort({brand: 1});
        const categoryData = await Category.find({isList:true});
       
            res.render("user/categorysort",{user:userid,category:categoryData,products:products});


    }
    catch(error){
        console.log(error,"lowToHigh page error");
    }
}


const ZtoA =  async(req,res)=>{
    try{
        
       
        const userid = req.session.user;
        const products = await Products.find({}).sort({brand: -1});
        const categoryData = await Category.find({isList:true});
       
            res.render("user/categorysort",{user:userid,category:categoryData,products:products});


    }
    catch(error){
        console.log(error,"lowToHigh page error");
    }
}

const searchedData = async(req,res)=>{
    try{
        const userid = req.session.user;
      
        const categoryData = await Category.find({isList:true});
        const searchedData = req.body.query;
        const regex = new RegExp('^' + searchedData, 'i');
        const searchedProducts = await Products.find({brand: {$regex: regex}});
        res.render("user/categorysort",{user:userid,category:categoryData,products:searchedProducts});
        

    }
    catch(error){
        console.log(error,"searchedData page error");
    }
}



module.exports = {
    categorySort,
    lowToHigh,
    HighToLow,
    AtoZ,
    ZtoA,
    searchedData

}