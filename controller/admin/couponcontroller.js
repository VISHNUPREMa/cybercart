const Coupons = require("../../model/couponSchema")


const getCouponPage = async (req, res) => {
    try {

        const coupons = await Coupons.find({});

        res.render("admin/coupon", { coupons: coupons })


    }
    catch (error) {
        console.log(error);
    }
}


const postCouponData = async (req, res) => {
    try {
        const { name, discount, purchase, start, end } = req.body;
        const data = {
            couponName: name,
            startDate: new Date(start + 'T00:00:00'),
            endDate: new Date(end + 'T00:00:00'),
            minimumPurchase: purchase,
            discount: discount
        }

        const couponData = await Coupons.create({
            name: data.couponName,
            discount: data.discount,
            purchaseamount: data.minimumPurchase,
            start: data.startDate,
            end: data.endDate
        })

        res.redirect("/admin/coupons")





    }
    catch (error) {
        console.log(error, "postCouponData page error");
    }
}


const deleteCoupon = async (req, res) => {
    try {
        const couponID = req.query.id; 
        await Coupons.findByIdAndDelete(couponID);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log("deleteCoupon page error : ", error);

        res.status(500).send("Error deleting coupon");
    }
}


module.exports = {
    getCouponPage,
    postCouponData,
    deleteCoupon
}