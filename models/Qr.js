const mongoose = require("mongoose");

const QrSchema = new mongoose.Schema({
    qrString: {type:String, require: true},
    createdAt: {type:Date, default: Date.now},
    dustbin: {type: mongoose.Schema.Types.ObjectId, ref:'Dustbin', required:true},
    consumer: {type: mongoose.Schema.Types.ObjectId, ref:'Consumer'}
})

module.exports = mongoose.model('Qr',QrSchema);