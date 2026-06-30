const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  addaiNo: Number,
  stockNo: String,
  oldstockNo: Number,

  folderName: String,
  product: String,
  productDesc: String,
  weight: String,

  purchaseDate: Date,
  expiryDate: Date,

  price: Number,
  profit: Number,
  sellingPrice: Number,

  folderNo: String,
  mrp: Number,
  tax: Number
}, { timestamps: true });

module.exports = mongoose.model('Purchase-update', purchaseSchema);