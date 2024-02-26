
const Orders = require("../../model/orderSchema");
const Categories = require("../../model/category")
const moment = require("moment");

const getSalesReport = async (req, res) => {
    try {
        const orderData = await Orders.find({});
        

        res.render("admin/salesreport", { orders: orderData });

    } catch (error) {
        console.log("getSalesReport page error", error);

        res.status(500).send("Internal Server Error");
    }
};



const getFilteredSalesReport = async (req, res) => {
    try {
        const filterOptions = req.body.selectstatus;
        const dateString = req.body.date;

        if (filterOptions !== undefined) {
            // Code execution based on filterOptions
            if (filterOptions === "Daily") {
                const today = moment().startOf('day').utc();
                const formattedDate = today.format('DD/MM/YYYY hh:mm:ss A').toString();
                const orderData = await Orders.find({ createdon: { $gte: formattedDate } });
            

                return res.render("admin/salesreport", { orders: orderData });
            } else if (filterOptions === "weekly") {
                const startOfWeek = moment().startOf('week');
                const formattedDate = startOfWeek.format('DD/MM/YYYY hh:mm:ss A').toString();
                const orderData = await Orders.find({ createdon: { $gte: formattedDate } });
                return res.render("admin/salesreport", { orders: orderData });
            } else if (filterOptions === "monthly") {
                const startOfMonth = moment().startOf('month');
                const formattedDate = startOfMonth.format('DD/MM/YYYY hh:mm:ss A').toString();
                const orderData = await Orders.find({ createdon: { $gte: formattedDate } });
         

                return res.render("admin/salesreport", { orders: orderData });
            }
        } else if (dateString !== undefined) {
           
            let parts = dateString.split("-");
            let reversedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
            const formattedDate = moment(reversedDate, 'DD-MM-YYYY').format('DD/MM/YYYY').toString();
            console.log("date : ",formattedDate);
            const orderData = await Orders.find({ createdon: { $regex :  formattedDate }  });
      

               return res.render("admin/salesreport", { orders: orderData }); 
        }
    } catch (error) {
        console.log("getFilteredSalesReport page error", error);
       
        res.status(500).send("Internal Server Error");
    }
}





module.exports = {
    getSalesReport,
    getFilteredSalesReport

}


