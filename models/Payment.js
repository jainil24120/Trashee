const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true }, // Reference to the Partner
    subscriptionPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true }, // Reference to the SubscriptionPlan
    order_id: { type: String, required: true },
    paymentId: { type: String, sparse: true },// Nullable until payment is completed,
    payment_time: { type: Date, default: Date.now }, // Payment timestamp
    payment_status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' }, // Payment status
    paid_amount: { type: Number, required: true }, // Amount paid
    createdAt: { type: Date, default: Date.now } // Timestamp of payment record creation
});

module.exports = mongoose.model('Payment', PaymentSchema);