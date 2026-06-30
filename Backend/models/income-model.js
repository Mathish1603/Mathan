const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  date: { type: Date },
  type: { type: String, enum: ['வரவு', 'அட்வான்ஸ்'], required: true },
  name: { type: String, required: true },
  supplier: { type: String, required: true },
  paymentMethod: { type: String, enum: ['கேஷ்', 'பாங்க்'], required: true },
  description: { type: String },
  referenceNo: { type: String },
  cashierNo: { type: String },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);