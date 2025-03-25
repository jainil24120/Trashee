const mongoose = require('mongoose');

const DustbinSchema = new mongoose.Schema({
    binCode: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['ON','OF'], required: true },
    pincode: {type: String, required:true},
    status: {type:String, enum:['EM','10','20','30','40','50','60','70','80','90','FL'], default:'EM'},  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dustbin', DustbinSchema);
