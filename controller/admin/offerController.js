const Products = require("../../model/productmanage");
const Category = require("../../model/category");
const Offers = require("../../model/offerSchema");


const getAdminOfferPage = async (req, res) => {
    try {
        const products = await Products.find({ isListed: true }).populate("category");
       
        const categories = await Category.find({ isList: true });

        const brands = [...new Set(products.map(product => product.brand))];
        const offers = await Offers.find({});
        const offeredBrands = offers.map(offer => offer.brand);
        const productsWithOfferedBrand = products.filter(product => offeredBrands.includes(product.brand));
        const offerCategories = offers.map(offer =>offer.category);
        const productsWithOfferCategories = products.filter(product => offerCategories.includes(product.category.name));
        
        const today = new Date(); 
        const formattedToday = today.toLocaleString();
        
      
        
        for (let product of productsWithOfferedBrand) {
            const correspondingOffer = offers.find(offer => offer.brand === product.brand);
           
            if (correspondingOffer) {
                if(formattedToday >= correspondingOffer.start && formattedToday <= correspondingOffer.end){
                    
                
               
               if(product.discountApplied === false){
                product.offerprice -= correspondingOffer.discount;
                product.discountApplied = true;
                await product.save();
                console.log("product (brand) : ",product);
               }
            }

            }
        }

        for(let product of productsWithOfferCategories){
            const correspondingOffer = offers.find(offer=> offer.category === product.category.name );
            console.log("corresponding offer : ",correspondingOffer);
            if(correspondingOffer){
                if(formattedToday >= correspondingOffer.start && formattedToday <= correspondingOffer.end){
                if(product.discountApplied === false){
                    product.offerprice -= correspondingOffer.discount;
                product.discountApplied = true;
                await product.save();
                console.log("products (category) : ",product);

                }
            }
            }
        }

        
        
        

        res.render("admin/offer", { brands, categories, offers , offerActive:true })

    } catch (error) {
        console.log("getAdminOfferPage page error : ", error);
    }
}



const postOfferDetails = async (req, res) => {
    try {
        const { options, brand, category, discount, purchase} = req.body;
        const start = new Date(req.body.start);
const end = new Date(req.body.end);

        const formattedStartDate = start.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedEndDate = end.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        if (options === 'Product') {
            const existingOffer = await Offers.findOne({ brand:brand });
            if (existingOffer) {
                return res.status(200).json({ message: "Offer already added to the product" });
            }else{
            const newOffer = await Offers.create({
                brand: brand,
                discount: discount,
                purchaseamount: purchase,
                start: formattedStartDate,
                end: formattedEndDate,
                type:options
            });
            res.status(200).json({ message: "Offer added successfully" });
        }
        } else if (options === 'category') {
            const existingOffer = await Offers.findOne({ category : category});
          
            const categoryData = await Category.findById(category);
        

            if (existingOffer) {
                return res.status(200).json({ message: "Offer already added in this category" });
            }else{
            const newOffer = await Offers.create({
                category: categoryData.name,
                discount: discount,
                purchaseamount: purchase,
                start: formattedStartDate,
                end: formattedEndDate,
                type:options
            });
            res.status(200).json({ message: "Offer added successfully" });
        }
        }
       
    } catch (error) {
        console.log("postOfferDetails page error : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteOffer = async (req, res) => {
    try {
        const offerid = req.query.id;
        const offerData = await Offers.findById(offerid);
        
        if (offerData && offerData.type === "category") {
            const productData = await Products.find({ isListed: true }).populate("category");
            
            for (let product of productData) {
                if (product.category.name === offerData.category) {
                    product.offerprice += offerData.discount;
                    product.discountApplied = false;
                    await product.save();
                }
            }
            
            await offerData.deleteOne();
           res.redirect("/admin/offers")

        } else if(offerData && offerData.type === "Product") {
            const productData = await Products.find({ isListed: true }).populate("category");

            for (let product of productData) {
                if (product.brand === offerData.brand) {
                    product.offerprice += offerData.discount;
                    product.discountApplied = false;
                    await product.save();
                }
            }
            
            await offerData.deleteOne();
           res.redirect("/admin/offers")



            
        }
    } catch (error) {
        console.log("deleteOffer page error", error);
        res.status(500).send({ error: "Internal server error" });
    }
};



module.exports = {
    getAdminOfferPage,
    postOfferDetails,
    deleteOffer
    
}