const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AddressSchema = new mongoose.Schema({
    address: { type: String },
    pincode: { type: String },
    shopGst: { type: String }
}, { _id: false });

const PartnerSchema = new mongoose.Schema({
    shopName: { type: String },
    addresses: [AddressSchema], // Array of address objects
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'partner' },
    password: { type: String, minLength: 8, required: true },
    status: { type: String, enum: ['Approved', 'Disapproved', 'waiting'], default: 'waiting' }, // Shop status
    usedOffers: { type: Number, default: 0 }, // Track offers created
    subscription: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partner', PartnerSchema);