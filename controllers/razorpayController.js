const { createRazorpayInstance } = require("../config/configRazorpay");
require("dotenv").config();
const crypto = require("crypto");
const razorpayInstance = createRazorpayInstance();
const Partner = require("../models/Partner");
const jwt = require('jsonwebtoken');
const Payment = require("../models/Payment");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const Subscription = require("../models/Subscription");

exports.createOrder = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Partner.findOne({ email: decoded.email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Partner not found" });
        }
        
        const subscription = await SubscriptionPlan.findById(subscriptionId);
        if (!subscription) {
            return res.status(400).json({ success: false, message: "Invalid subscription ID" });
        }
        
        const numericPrice = parseFloat(subscription.price.replace(/[^0-9.]/g, ""));
        console.log(numericPrice);
        const options = { amount: numericPrice * 100, currency: "INR" };
        const order = await razorpayInstance.orders.create(options);
        
        const newPayment = new Payment({
            partner: user._id,
            subscriptionPlan: subscription._id,
            order_id: order.id,
            payment_status: 'pending',
            paid_amount: numericPrice,
        });

        const savedPayment = await newPayment.save();
        console.log(newPayment);
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + subscription.durationDays);
        
        const newSubscription = new Subscription({
            partner: user._id,
            payment: savedPayment._id,
            subscriptionPlan: subscription._id,
            startDate: startDate,
            endDate: endDate,
            status: 'in_process',
        });

        await newSubscription.save();
        console.log(order);
        return res.status(200).json({ success: true, order });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong while creating the order.", error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        console.log("🔍 Received verifyPayment request:", req.body);

        // Extract payment details from the request
        const { order_id, payment_id, signature } = req.body;

        // Validate required fields
        if (!order_id || !payment_id || !signature) {
            console.error("❌ Missing required payment details.");
            return res.status(400).json({ success: false, message: "Missing required payment details." });
        }

        // Fetch secret key from environment variables
        const secret = process.env.YOUR_KEY_SECRET;
        if (!secret) {
            console.error("❌ Razorpay key secret is missing.");
            return res.status(500).json({ success: false, message: "Razorpay key secret is missing." });
        }

        // Generate HMAC signature for verification
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest("hex");

        console.log("🔑 Generated Signature:", generatedSignature);
        console.log("🔑 Razorpay Signature:", signature);

        // Compare signatures
        if (generatedSignature !== signature) {
            console.error("❌ Payment verification failed: Signature mismatch.");
            return res.status(400).json({ success: false, message: "Payment verification failed: Invalid signature." });
        }

        // Find the payment record in the database
        const payment = await Payment.findOne({ order_id });

        if (!payment) {
            console.error("❌ Payment record not found for order_id:", order_id);
            return res.status(404).json({ success: false, message: "Payment record not found." });
        }

        // Update payment status in database
        payment.paymentId = payment_id;
        payment.payment_status = 'success';
        await payment.save();
        console.log("✅ Payment updated successfully in database.");

        // Activate the subscription
        const subscription = await Subscription.findOne({ payment: payment._id });

        if (!subscription) {
            console.error("❌ Subscription record not found for payment:", payment._id);
            return res.status(404).json({ success: false, message: "Subscription record not found." });
        }

        subscription.status = 'active';
        await subscription.save();
        console.log("✅ Subscription activated successfully.");

        return res.status(200).json({ success: true, message: "Payment verified and subscription activated." });

    } catch (err) {
        console.error("❌ Error in payment verification:", err);
        return res.status(500).json({ success: false, message: "An error occurred during payment verification.", error: err.message });
    }
};