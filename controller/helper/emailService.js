
const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });

  
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: 'Your OTP for verification',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Failed to send the mail', error);
    } else {
      console.log('OTP sent to mail:', info.response);
    }
  });
};

module.exports = { sendOtpEmail };
