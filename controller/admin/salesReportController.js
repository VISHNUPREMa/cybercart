
const Orders = require("../../model/orderSchema");
const Categories = require("../../model/category");

const moment = require("moment");
const ExcelJS = require("exceljs")

const getSalesReport = async (req, res) => {
    try {
        const orderData = await Orders.find({});
        

        res.render("admin/salesreport", { orders: orderData,salesActive:true });

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
          
            if (filterOptions === "Daily") {
                const today = moment().startOf('day');
                const formattedDate = today.format('DD/MM/YYYY hh:mm:ss A').toString();
                const orders = await Orders.find({ });
                let orderData =[]
               
                
                for (let order of orders) {
                    const orderDate = moment(order.createdon); 
                    if (orderDate.isSameOrAfter(formattedDate, 'day')) {
                        
                        orderData.push(order);
                    }
                }
            

                return res.render("admin/salesreport", { orders: orderData });
            } else if (filterOptions === "weekly") {
                let orderData = [];
                const startOfWeek = moment().startOf('week');
                const formattedDate = startOfWeek.format('DD/MM/YYYY hh:mm:ss A').toString();
                const orders = await Orders.find({ });
                for(let order of orders){
                    const orderDate = moment(order.createdon);
                    if (orderDate.isSameOrAfter(formattedDate, 'day')) {
                        
                        orderData.push(order);
                    }


                }
                return res.render("admin/salesreport", { orders: orderData });
            } else if (filterOptions === "monthly") {
                let orderData = [];
                const startOfMonth = moment().startOf('month');
                const formattedDate = startOfMonth.format('DD/MM/YYYY hh:mm:ss A').toString();
                const orders = await Orders.find({ });
                for(let order of orders){
                    const orderDate = moment(order.createdon);
                    if (orderDate.isSameOrAfter(formattedDate, 'day')) {
                        
                        orderData.push(order);
                    }


                }

         

                return res.render("admin/salesreport", { orders: orderData });
            }
        } else if (dateString !== undefined) {
           
            let parts = dateString.split("-");
            let reversedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
            const formattedDate = moment(reversedDate, 'DD-MM-YYYY').format('DD/MM/YYYY').toString();
           
            const orderData = await Orders.find({ createdon: { $regex :  formattedDate }  });
      

               return res.render("admin/salesreport", { orders: orderData }); 
        }
    } catch (error) {
        console.log("getFilteredSalesReport page error", error);
       
        res.status(500).send("Internal Server Error");
    }
}

const excelData = async(req,res)=>{
    try{
     
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        worksheet.columns = [ 
            { header: "ORDER ID", key: "orderid", width: 25 }, 
            { header: "Customer Name", key: "name", width: 40 }, 
            { header: "Ordered Date", key: "date", width: 40 }, 
            { header: "Total Price", key: "total", width: 40 }, 
            { header: "Payment Status", key: "status", width: 40 }, 
            { header: "Payment Method", key: "method", width: 40 }, 
            ];
            const datas = req.body.salesData;
              

            datas.forEach(data => { worksheet.addRow({
                orderid : data.orderID,
                name : data.customerName,
                date : data.orderedDate,
                total : data.total,
                status : data.paymentStatus,
                method : data.paymentMethod


            });
         });

         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=salesReport.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }
    catch(error){
        console.log("excelData page error : ",error);
    }
}





module.exports = {
    getSalesReport,
    getFilteredSalesReport,
    excelData

}


