const express = require("express");
const router = express.Router(); 
const subscriptionController = require("../controllers/subscriptionController");
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post("/plans",verifyToken, isAdmin, subscriptionController.createSubscriptionPlan);
router.get("/plans", subscriptionController.getSubscriptionPlans);
router.put("/plans/:id",verifyToken, isAdmin, subscriptionController.updateSubscriptionPlan);
router.delete("/plans/:id",verifyToken,isAdmin,subscriptionController.deleteSubscriptionPlan);
module.exports = router;
