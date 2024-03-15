const Message = require("../../model/messageSchema")


const nodemailer = require('nodemailer');
const {sendTextReply} = require("../../helper/emailService");


const getAllMessages = async(req,res)=>{
   try {
    const messages = await Message.find({})
    
    res.render("admin/allmessages",{messages})
   } catch (error) {
    
   }
}


const deleteMessage = async(req,res)=>{
    
    try {
        const id = req.body.id;
       
         await Message.findByIdAndDelete(id);
     
        res.status(200).json({})

        
    } catch (error) {
        
    }

}



const replyMessage = async(req,res)=>{
    try {
        const id = req.body.id;
        console.log("id : ",id);
        const reply = req.body.message;
        console.log("reply : ",reply);
        const messageData = await Message.findById(id);
        const recepientMail = messageData.email
        console.log("recepientMail : ",recepientMail);
        await sendTextReply(recepientMail,reply)
        res.json({ success: true, message: 'Text reply sent successfully' });

        
    } catch (error) {
        
    }
}



module.exports = {
    getAllMessages,
    deleteMessage,
    replyMessage
}