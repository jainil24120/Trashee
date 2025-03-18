const mongoose = require('mongoose');

const DustbinSchema = new mongoose.Schema({
    binCode: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Plastic', 'Paper', 'Wet', 'Other'], required: true },
    totalWeight: { type: Number, default: 0 },
    lastCollectedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dustbin', DustbinSchema);
