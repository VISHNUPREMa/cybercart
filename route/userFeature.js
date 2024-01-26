const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userController");


router.get("/",userController.getHomePage);
router.get("/login",userController.loadlogIn);

router.get("/signin",userController.loadSignIn);
router.post("/signin",userController.signInUser);
router.get("/verifyotp",userController.loadOtpPage);
router.post("/verifyotp", userController.otpPage);
router.post("/login",userController.logIn);




module.exports = router;

