const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userController");
const productController = require("../controller/user/productDetails");
const cartController = require("../controller/user/cartController");
const orderController = require("../controller/user/orderController");
const userProfileController = require("../controller/user/userProfileController");
const sortController = require("../controller/user/sortController");
const wishlistController = require("../controller/user/wishlistcontroller");
const walletController = require("../controller/user/walletController");
const reviewController = require("../controller/user/reviewController")


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
router.get("/forgetpassword/otppage",userController.loadOtpPageForPassword)
router.post("/forgetpasswordverify",userController.otpVerifyPasswordReset);
router.get("/passwordresetpage",userController.newPasswordVerify)

router.post("/forgetpassword/resend",userController.resndOtpForForgetpassword);

router.post("/passwordreset",userController.newPasswordReset)

router.get("/logout",isUser,userController.logoutUser);

router.get("/shop",isUser,userController.laodShopPage);
router.get("/productdetail/:id",productController.loadProductDetails);


router.get("/profile",isUser,userProfileController.getProfilePage);
router.get("/createaddress",isUser,userProfileController.getCreateAddressPage);
router.post("/createaddress",isUser,userProfileController.postAddressDetails);
router.get("/editaddress",isUser,userProfileController.getEditAddressPage);
router.post("/editaddress",isUser,userProfileController.postEditAdress);

router.post("/editprofile",isUser,userProfileController.postEditPassword);









router.post("/cart",isUser, cartController.addToCart);
router.get("/cart",isUser, cartController.loadCartPage);
router.get("/cart/deleteitem",isUser,cartController.deleteItem);
router.post("/updatequantity",isUser,cartController.updateQuantity);
      

router.get("/checkout",isUser,orderController.loadCheckoutPage);
router.post("/checkout",orderController.applyCoupon)
router.post("/placeorder",isUser,orderController.postorderDetails);
router.post("/onlinepaymentfailed",orderController.onlinePaymentFailed)
router.post("/verifypayment",orderController.verifyRazorpay);
router.get("/orderdetails",isUser,orderController.loadOrderDetailPage);
router.get("/deletesingleproduct",orderController.deleteSingleProduct)
router.post("/deleteorder",isUser,orderController.deleteOrder);
router.post("/returnorder",orderController.returnOrder);
router.get("/continuepayment",orderController.continuePaymentForPaymentFail);
router.post("/repayment",orderController.postRepaymentData);
router.post("/cancelpendingorder",orderController.cancelPendingOrder);




router.get("/categorysort",isUser,sortController.categorySort);
router.get("/categorysort/lowtohigh",isUser,sortController.lowToHigh);
router.get("/categorysort/hightolow",isUser,sortController.HighToLow);
router.get("/categorysort/A-Z",isUser,sortController.AtoZ);
router.get("/categorysort/Z-A",isUser,sortController.ZtoA);
router.post("/searchproduct",isUser,sortController.searchedData)



router.get("/wishlist",isUser,wishlistController.getWishList);
router.post("/wishlist/add",isUser,wishlistController.addToWishlist);
router.get("/wishlist/delete",isUser,wishlistController.deleteWishlist);


router.post("/addToWallet",walletController.addMoneyToWallet);



router.get("/invoice",orderController.getInvoice);


router.post("/reviewproduct",reviewController.postReviewDetails);


router.get("/about",userController.loadAboutPage);
router.get("/contact",userController.loadContactPage);
router.post("/contact",userController.postQueries)











module.exports = router;

