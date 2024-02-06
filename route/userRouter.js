const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userController");
const productController = require("../controller/user/productDetails");
const cartController = require("../controller/user/cartController");
const orderController = require("../controller/user/orderController");
const userProfileController = require("../controller/user/userProfileController");


const {isUser} = require("../middlewares/authentication")


router.get("/productdetail/:id",isUser,productController.loadProductDetails)
router.get("/",userController.getHomePage);
router.get("/login",userController.loadlogIn);

router.get("/signin",userController.loadSignIn);
router.post("/signin",userController.signInUser);

router.get("/verifyotp",userController.loadOtpPage);

router.post('/resendotp', userController.resendOtp);

router.post("/verifyotp",userController.otpPage);

router.post("/login",userController.logIn);
router.get("/forgetpassword",userController.forgetPasswordLoad);
router.post("/forgetpassword",userController.forgetpassword);
router.post("/forgetpasswordverify",userController.otpVerifyPasswordReset);
router.get("/forgetpassword/resend",userController.resndOtpForForgetpassword);

router.get("/logout",userController.logoutUser);

router.get("/shop",userController.laodShopPage);


router.get("/profile",userProfileController.getProfilePage);
router.get("/createaddress",userProfileController.getCreateAddressPage)








router.post("/cart", cartController.addToCart);
router.get("/cart", cartController.loadCartPage);
router.get("/cart/deleteitem",cartController.deleteItem);


router.get("/checkout",orderController.loadCheckoutPage);

















module.exports = router;

