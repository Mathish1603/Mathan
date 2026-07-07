const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: { type: Date },
  type: { type: String, enum: ['செலவு', 'பற்று'], required: true },
  name: { type: String, required: true },
  supplier: { type: String, required: true },
  paymentMethod: { type: String, enum: ['','கேஷ்', 'பாங்க்']},
  description: { type: String },
  product: { type: String },
  referenceNo: { type: String },
  cashierNo: { type: String },
  amount: { type: Number, required: true }

}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);