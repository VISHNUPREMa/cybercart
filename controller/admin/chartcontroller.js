const Orders = require("../../model/orderSchema");
const Products = require("../../model/productmanage");
const Users = require("../../model/userModel")


const getChartData = async (req, res) => {
    try {
        let products = [];
        let users = [];
        const allOrders = await Orders.find({});
        const allProductsCount = await Products.find({isListed:true}).count();
        
        const allUsersCount = await Users.find({isBlocked:false}).count();
      
       products.push(allProductsCount);
       users.push(allUsersCount)

       
        const ordersByDate = {};
        allOrders.forEach(entry => {
            const createdDate = new Date(entry.createdon.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')).toISOString().split('T')[0];
            if (!ordersByDate[createdDate]) {
                ordersByDate[createdDate] = 0;
            }
            ordersByDate[createdDate]++;
        });

        // Debugging
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Convert keys to day of the week
        const ordersByDayOfWeek = {};
        for (const dateStr in ordersByDate) {
            const date = new Date(dateStr);
            const dayOfWeek = daysOfWeek[date.getDay()];
            ordersByDayOfWeek[dayOfWeek] = ordersByDate[dateStr];
        }

        // Output the counts
      

        // Function to fill missing days with 0 orders
        function fillMissingDays(data) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const filledData = {};
            daysOfWeek.forEach(day => {
                filledData[day] = data[day] || 0;
            });
            return filledData;
        }

        // Fill missing days with 0 orders
        const filledOrdersData = fillMissingDays(ordersByDayOfWeek);
   
      
     
        res.status(200).json({ order: filledOrdersData, product:products , user:users });

    } catch (error) {
        console.log("getChartData page error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const getBarChartData = async (req, res) => {
    try {
        const orders = await Orders.find({});
        let brandTotals = {};

        orders.forEach(order => {
            order.products.forEach(product => {
                if (!brandTotals[product.brand]) {
                    brandTotals[product.brand] = product.offerprice;
                } else {
                    brandTotals[product.brand] += product.offerprice;
                }
            });
        });

        let brands = [];
        let totalOfferPrices = [];
        for (const brand in brandTotals) {
            brands.push(brand);
            totalOfferPrices.push(brandTotals[brand]);
        }

        res.status(200).json({ brands, totalOfferPrices });
    } catch (error) {
        console.log("Error in getBarChartData: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




module.exports = {
    getChartData,
    getBarChartData
}



