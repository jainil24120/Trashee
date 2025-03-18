const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, unique: true },
    subscriptionPlan: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    startDate: { type: Date, required: true },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate; // Ensure endDate is after startDate
            },
            message: 'End date must be after the start date.',
        },
    },
    status: { type: String, enum: ['active', 'expired', 'canceled','in_process'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Subscription', subscriptionSchema);