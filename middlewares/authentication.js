const User = require("../model/userModel");

const isUser = async(req,res,next)=>{
  try{
    if(req.session.user){
         await User.findById({ _id: req.session.user }).lean()
        .then((data)=>{
            if(data.isBlocked === false ){
                next();
            }else{
                res.redirect("/login");
            }
        })
        
    }
  }
  catch(error){
    console.log(error, "isUser error");
  }
}




const isAdmin = async(req,res,next)=>{
    try{
        if(req.session.admin){
            await User.findOne({isAdmin:1}).lean()
            .then((data)=>{
                if(data){
                    next()
                }else{
                    res.redirect("/admin");
                }
            })

        }

    }catch(error){
        console.log(error,"isAdmin error");

    }
}


module.exports ={isUser , isAdmin}