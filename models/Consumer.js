const mongoose = require('mongoose');

const ConsumerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8},
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    points: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Consumer', ConsumerSchema);
