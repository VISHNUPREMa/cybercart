const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/admincontroller");
const userlisting = require("../controller/admin/userlisting");
const categoryManagement = require("../controller/admin/categoryManagement");
const addProduct = require("../controller/admin/addproduct")



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








module.exports = router