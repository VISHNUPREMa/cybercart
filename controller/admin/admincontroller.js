const User = require("../../model/userModel");
const Category = require("../../model/category");
const Products = require("../../model/productmanage");
const Orders = require("../../model/orderSchema");
const Notification = require("../../model/notificationSchema")
const bcrypt = require("bcrypt");


const getAdminHomePage = async(req,res)=>{
    try{
        if(req.session.admin){
         

            res.redirect("/admin/dashboard");

        }else{
            res.render("admin/adminlogin");
        }

    }
    catch(error){
        console.log(error,"admin home page cannot render");
    }
}



const adminHomePagePost = async (req, res) => {
    try {
        const{email,password} = req.body;
        const isAdmin = await User.findOne({email:email,isAdmin:1});
        req.session.admin = isAdmin._id;
        
        
        if(isAdmin){
            const validatePassword = await bcrypt.compare(password,isAdmin.password);
            if(validatePassword){
             
                res.redirect("admin/dashboard");

            }else{
                res.render("admin/adminlogin",{message:"password mismatch"})
            }
        }else{
            res.render("admin/adminlogin",{message:"Admin details not found"})
        }
        
       

    } catch (error) {
        console.log(error, "adminHomePagePost  page error");
    }
}


const loadDashboardHome = async(req,res)=>{
    try{
        const OrderData = await Orders.find({}); 
        const productData  = await Products.find({isListed:true});
        const categoryData = await Category.find({isList:true});
        const userData = await User.find({isBlocked:false}); 
        const orders = await Orders.find({});
       
        let brandTotals = {};
        let brandCounts = {}; 
        let productTotals = {};
        let productCounts = {}

        orders.forEach(order => {
            order.products.forEach(product => {
                if (!brandTotals[product.brand]) {
                    brandTotals[product.brand] = product.offerprice;
                    brandCounts[product.brand] = 1; 
                } else {
                    brandTotals[product.brand] += product.offerprice;
                    brandCounts[product.brand]++; 
                }
            });
        });


        const brandArray = Object.entries(brandTotals);
        brandArray.sort((a,b) => b[1] - a[1]);

        const sortedBrandTotals ={};
        brandArray.forEach(([key , value])=>{
            sortedBrandTotals[key] = value;
        })

       


        const brandCountArray = Object.entries(brandCounts);
        brandCountArray.sort((a,b)=> b[1] - a[1]);
        const sortedBrandCount = {};
        brandCountArray.forEach(([key,value]) =>{
            sortedBrandCount[key] = value
        })


  

      
        const brandNames = Object.keys(sortedBrandTotals);
        const brandValues = Object.values(sortedBrandTotals)
        const brandNumbers = Object.values(sortedBrandCount)
       


        // Count of brandTotals
        orders.forEach(order=>{
            order.products.forEach( product=>{
                if(!productTotals[product.name]){
                    productTotals[product.name] = product.offerprice;
                    productCounts[product.name] = 1;
                }else{
                    productTotals[product.name] += product.offerprice;
                    productCounts[product.name]++;

                }

            })
        })

        const productTotalArray = Object.entries(productTotals);
        productTotalArray.sort((a,b) => b[1] - a[1]);

        const sortedProductTotals = {};
        productTotalArray.forEach(([key,value]) =>{
            sortedProductTotals[key] = value;
        });


     

        const productCountArray = Object.entries(productCounts);
        productCountArray.sort((a,b) => b[1] - a[1]);

        const sortedProductCount = {};
        productCountArray.forEach(([key,value]) =>{
            sortedProductCount[key] = value;
        })
       




        

        const productNames = Object.keys(sortedProductCount);
        const productValues = Object.values(sortedProductTotals);
        const productNumbers = Object.values(sortedProductCount);

       
        const topProducts = productData
        .filter(product => productNames.includes(product.name))
        .sort((a, b) => {
            const indexA = productNames.indexOf(a.name);
            const indexB = productNames.indexOf(b.name);
            return indexA - indexB;
        });
    

       
        let topProductsImages = [];
        for(let product of topProducts){
            topProductsImages.push(product.image)

        }
          
        const notification = await Notification.aggregate([
            {
                $match: {} // You can add match conditions here if needed
            },
            {
                $lookup: {
                    from: "users", // The collection to perform the lookup
                    localField: "sentbtuser", // Field in the current collection
                    foreignField: "_id", // Field in the "users" collection
                    as: "sentByUser" // Name of the field to store the result
                }
            },
            {
                $addFields: {
                    sentByUser: { $arrayElemAt: ["$sentByUser", 0] } // Convert sentByUser array to single object
                }
            },
            {
                $project: {
                    _id: 1,
                    orderid: 1,
                    message: 1,
                    sentByUser: { _id: 1, name: 1, email: 1 } // Specify the fields you want from the user document
                }
            }
        ]);
        
        console.log("notification with users: ", notification);
        

        res.render("admin/admindashboard",{orders:OrderData,products:productData,categories:categoryData,users:userData,dashboardActive:true,brandNames,brandValues,brandNumbers,productNames,productValues,productNumbers,topProductsImages,notification});

    }
    catch(error){
        console.log(error,"loadDashboardHome   page error");
    }
}

const logoutAdmin = async(req,res)=>{
    try{
        req.session.admin = null;
        res.redirect("/admin")
        
        


    }
    catch(error){
        console.log(error,"logoutAdmin page error");
    }
}





module.exports = {
    getAdminHomePage,
    adminHomePagePost,
    loadDashboardHome,
    logoutAdmin
    
   };










