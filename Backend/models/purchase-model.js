const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  supplier: String,
  quantity: Number,
  folderName: String,
  product: String,
  productDesc: String,
  minQty: Number,
  purchaseDate: Date,
  expiryDate: Date,
  price: Number,
  profit: Number,
  sellingPrice: Number,
  folderNo: String,
  mrp: Number,
  tax: Number
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);