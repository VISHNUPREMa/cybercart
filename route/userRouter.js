const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userController");
const productController = require("../controller/user/productDetails");
const cartController = require("../controller/user/cartController");
const orderController = require("../controller/user/orderController");
const userProfileController = require("../controller/user/userProfileController");


const {isUser} = require("../middlewares/authentication")



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
router.post("/forgetpassword/resend",userController.resndOtpForForgetpassword);
router.post("/passwordreset",userController.newPasswordReset)

router.get("/logout",isUser,userController.logoutUser);

router.get("/shop",isUser,userController.laodShopPage);
router.get("/productdetail/:id",isUser,productController.loadProductDetails);


router.get("/profile",isUser,userProfileController.getProfilePage);
router.get("/createaddress",isUser,userProfileController.getCreateAddressPage);
router.post("/createaddress",isUser,userProfileController.postAddressDetails);
router.get("/editaddress",isUser,userProfileController.getEditAddressPage);
router.post("/editaddress",isUser,userProfileController.postEditAdress);
router.post("/editprofile",userProfileController.postEditPassword);









router.post("/cart",isUser, cartController.addToCart);
router.get("/cart",isUser, cartController.loadCartPage);
router.get("/cart/deleteitem",isUser,cartController.deleteItem);
router.post("/updatequantity",isUser,cartController.updateQuantity);


router.get("/checkout",isUser,orderController.loadCheckoutPage);
router.post("/placeorder",isUser,orderController.postorderDetails);
router.get("/orderdetails",orderController.loadOrderDetailPage);
router.post("/deleteorder",orderController.deleteOrder);


















module.exports = router;

