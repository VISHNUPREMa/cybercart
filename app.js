const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const nocache = require("nocache");
const session = require("express-session")
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();



const userAuthRoute = require("./route/userRouter");
const adminAuthRoute = require("./route/adminRouter")
const { error } = require("console");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:  process.env.SESSION_SECRET || "defaultSecret",
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");

const connect = mongoose.connect("mongodb+srv://vishnuprem5152:aV0yaITDMjrpiIXu@cluster0.ztasazg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

connect.then(()=>{
    console.log("Database connected");
})
.catch((error)=>{
    console.log(error);
})
     



app.use("/",nocache());
app.use("/admin",nocache());
app.use("/",userAuthRoute);
app.use("/admin",adminAuthRoute);





// app.use("*",(req,res)=>{
//     res.render("general/error")
// })


app.use((err,req,res,next)=>{
    console.log("error happend",err);
    res.status(500).json("CODE ERROR")
})



const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Listning to the server ${PORT}` );
})

