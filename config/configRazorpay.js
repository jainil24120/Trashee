const Razorpay = require('razorpay');
// const razorpayConfig = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();



exports.createRazorpayInstance =() =>{ 
    return new Razorpay({
    key_id:process.env.YOUR_KEY_ID,
    key_secret: process.env.YOUR_KEY_SECRET
});
}