const mongoose = require('mongoose');

const LeadgerEntrySchema = new mongoose.Schema({
  name: String,
  date: Date,
  accountNo: String,
  bank: String,
  ifsc: String,
  bankcity: String,
  // balance: Number,
  // type: String,
  personName: String,
  address: String,
  supplier: String,
  phone: String,
  pCity: String,
  state: String,
  gst: String,
  gCity: String
}, { timestamps: true });

module.exports = mongoose.model('Leadger', LeadgerEntrySchema);
