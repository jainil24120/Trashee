// models/subscriptionPlan.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionPlanSchema = new Schema({
  name: { type: String, required: true, enum:['Basic','Premium','Standard',"platinum"]},            // e.g., 'Basic', 'Premium', 'Enterprise'
  description: { type: String },
  price: { type: String, required: true },
  features: [{ type: String }],
  durationDays: { type: Number, required: true },      // Length of subscription in days
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
