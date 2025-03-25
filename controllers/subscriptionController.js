const SubscriptionPlan = require("../models/SubscriptionPlan");

// ✅ API to Create a Subscription Plan
exports.createSubscriptionPlan = async (req, res) => {
    try {
        const { name, description, price, features, durationDays, noOfOffer} = req.body;

        // Validate if the plan already exists
        const existingPlan = await SubscriptionPlan.findOne({ name });
        if (existingPlan) {
            return res.status(400).json({ success: false, message: "Subscription plan already exists." });
        }

        const newPlan = new SubscriptionPlan({
            name,
            description,
            price,
            noOfOffer,
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

exports.updateSubscriptionPlan = async (req,res)=>{
    try{
        const { id } = req.params;
       const updates = req.body;

        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            id,
            {$set: updates},
            {new:true, runValidators: true }
        )

        if (!updatedPlan) {
            return res.status(404).json({ success: false, message: "Subscription plan not found." });
        }

        res.status(200).json({ success: true, message: "Subscription plan updated successfully", data: updatedPlan });
    }catch(err){
        res.status(500).json({ success: false, message: "Error updating subscription plan", error: error.message })
    }
}


// ✅ API to Delete a Subscription Plan
exports.deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ success: false, message: "Subscription plan not found." });
        }

        res.status(200).json({ success: true, message: "Subscription plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting subscription plan", error: error.message });
    }
};

