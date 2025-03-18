const mongoose = require('mongoose');
const { Schema } = mongoose; 
const OfferSchema = new mongoose.Schema({
    offerId: { type: String, required: true, unique: true },
    offerName: { type: String, required: true },
    image: { type: String, required: true },
    offerDescription: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    brandName: { type: String, required: true },
    offerType: { type: String, enum: ['bulk', 'individual'], required: true },
    quantity: { type: Number, required: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    approved:{type:String, enum: ['approved','disapproved','waiting'], default:'waiting'}
});

module.exports = mongoose.model('Offer', OfferSchema);
