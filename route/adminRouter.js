const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/admincontroller");
const userlisting = require("../controller/admin/userlisting");
const categoryManagement = require("../controller/admin/categoryManagement");
const addProduct = require("../controller/admin/addproduct");
const productList = require("../controller/admin/productlist");

const {isAdmin} = require("../middlewares/authentication")


const upload = require("../helper/multerConfig")




router.get("/",adminController.getAdminHomePage);
router.post("/",adminController.adminHomePagePost);
router.get("/dashboard",isAdmin,adminController.loadDashboardHome);

router.get("/logout",isAdmin,adminController.logoutAdmin);



router.get("/userlist",isAdmin,userlisting.loadUserList);
router.get("/userlist/block/:id", isAdmin,userlisting.blockUser);
router.get("/userlist/unblock/:id", isAdmin, userlisting.unBlockUser);



router.get("/category", isAdmin,categoryManagement.loadCategoryPage);
router.post("/category", isAdmin,categoryManagement.categoryDetailsPost);
 router.get("/category/unlist/:id",isAdmin, categoryManagement.unlistCategory);
 router.get("/category/list/:id",isAdmin , categoryManagement.listCategory);
 router.get("/category/edit/:id", isAdmin , categoryManagement.loadEditCategory);
 router.post("/category/edit/:id", isAdmin , categoryManagement.postEditCategory);



 router.get("/addproduct", isAdmin ,upload.array("image",5), addProduct.loadAddProduct);
 router.post("/addproduct",isAdmin , upload.array("image",5), addProduct.addProduct);



 router.get("/productlist", isAdmin ,productList.loadProductList);
 router.get("/productlist/edit/:id", isAdmin, productList.loadEditProductPage);
 router.post("/productlist/edit/:id", isAdmin ,upload.array("image",5),productList.postEditProduct);


 router.get("/productlist/delete/:id", isAdmin ,productList.deleteProduct);
 








module.exports = router