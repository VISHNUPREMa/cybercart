const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/admincontroller");
const userlisting = require("../controller/admin/userlisting");
const categoryManagement = require("../controller/admin/categoryManagement");
const addProduct = require("../controller/admin/addproduct");
const productList = require("../controller/admin/productlist");


const upload = require("../helper/multerConfig")




router.get("/",adminController.getAdminHomePage);
router.post("/",adminController.adminHomePagePost);
router.get("/dashboard",adminController.loadDashboardHome);



router.get("/userlist",userlisting.loadUserList);
router.get("/userlist/block/:id", userlisting.blockUser);
router.get("/userlist/unblock/:id", userlisting.unBlockUser);



router.get("/category",categoryManagement.loadCategoryPage);
router.post("/category",categoryManagement.categoryDetailsPost);
 router.get("/category/unlist/:id",categoryManagement.unlistCategory);
 router.get("/category/list/:id",categoryManagement.listCategory);
 router.get("/category/edit/:id",categoryManagement.loadEditCategory);
 router.post("/category/edit/:id",categoryManagement.postEditCategory);



 router.get("/addproduct",addProduct.loadAddProduct);
 router.post("/addproduct", upload.array("image",5), addProduct.addProduct);



 router.get("/productlist",productList.loadProductList);
 router.get("/productlist/edit/:id", productList.loadEditProductPage);
 router.post("/productlist/edit/:id",upload.array("image",5),productList.postEditProduct);


 router.get("/productlist/delete/:id",productList.deleteProduct);
 








module.exports = router