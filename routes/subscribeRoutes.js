const express = require("express");
const router = express.Router(); 
const subscriptionController = require("../controllers/subscriptionController");
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post("/plans",verifyToken, isAdmin, subscriptionController.createSubscriptionPlan);
router.get("/plans", subscriptionController.getSubscriptionPlans);

module.exports = router;
