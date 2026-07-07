const mongoose = require('mongoose');

const rowSchema = new mongoose.Schema({
  sno: Number,
  date: Date,
  product: String,
  referenceNo: String,
  cashierNo: String,
  quantity: Number,
  price: Number,
  totalprice: Number,
  amount: Number,
  debit: Number,
  balance: Number
});

const reportSchema = new mongoose.Schema({
  name: String,
  bank: String,
  gst: String,
  supplier: String,
  accountNo: String,   
  pCity: String,    
  address: String,
  ifsc: String,
  state: String,
  bankcity: String,
  phone: String,
  rows: [rowSchema]

}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);