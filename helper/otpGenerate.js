const express = require("express");
const generateOTP = require("generate-otp");

function generateRandomOtp(){
    return generateOTP.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
}

function orderIdGenerate(){
    return generateOTP.generate(10, { digits: true, alphabets: true, upperCase: false, specialChars: false });
}

module.exports = {
    generateRandomOtp,
    orderIdGenerate
};