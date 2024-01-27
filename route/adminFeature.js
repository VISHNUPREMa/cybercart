const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/admincontroller")



router.get("/",adminController.getAdminHomePage);
router.post("/",adminController.adminHomePagePost);
router.get("/dashboard",adminController.loadDashboardHome)


module.exports = router