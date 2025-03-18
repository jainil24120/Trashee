const SubscriptionPlan = require("../models/SubscriptionPlan");

// ✅ API to Create a Subscription Plan
exports.createSubscriptionPlan = async (req, res) => {
    try {
        const { name, description, price, features, durationDays } = req.body;

        // Validate if the plan already exists
        const existingPlan = await SubscriptionPlan.findOne({ name });
        if (existingPlan) {
            return res.status(400).json({ success: false, message: "Subscription plan already exists." });
        }

        const newPlan = new SubscriptionPlan({
            name,
            description,
            price,
            features,
            durationDays,
        });

        await newPlan.save();
        res.status(201).json({ success: true, message: "Subscription plan created successfully", data: newPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating subscription plan", error: error.message });
    }
};

// ✅ API to Fetch All Subscription Plans
exports.getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({});
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching subscription plans", error: error.message });
    }
};
