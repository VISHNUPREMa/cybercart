const Reviews = require("../../model/review");
const { ObjectId } = require('mongodb');
const moment = require("moment-timezone")

const postReviewDetails = async (req, res) => {
    try {
        const { star, comment, productid } = req.body;
        console.log([star, comment, productid]);
        const userid = req.session.user;
        console.log("user id : ", userid);
        console.log(Number(star));
       
        const reviewData = await Reviews.create({
            reviewbyuser: new ObjectId(userid),
            star: Number(star),
            message: comment,
            product: new ObjectId(productid),
            createdon: moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm:ss A'),
        });

        console.log("reviewData : ", reviewData);
        res.status(200).json({message:"review upload successfully"})
        
    } catch(error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    postReviewDetails
};




























