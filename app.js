const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const nocache = require("nocache");
const session = require("express-session")
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();



const userAuthRoute = require("./route/userFeature");
const adminAuthRoute = require("./route/adminFeature")
const { error } = require("console");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:  process.env.SESSION_SECRET || "defaultSecret",
    cookie:{secure:false}
}))

app.use(express.static("public"))
app.set("view engine","ejs");

const connect = mongoose.connect("mongodb://localhost:27017/CyberCart");

connect.then(()=>{
    console.log("Database connected");
})
.catch((error)=>{
    console.log(error);
})





app.use("/",userAuthRoute);
app.use("/admin",adminAuthRoute);





app.use("*",(req,res)=>{
    res.status(404).json("Page not found")
})


app.use((err,req,res,next)=>{
    console.log("error happend",err);
    res.status(500).json("CODE ERROR")
})



const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Listning to the server ${PORT}` );
})

