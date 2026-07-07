const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  product: { type: String, required: true},
  productDetail: { type: String, required: true },
  folderName: { type: String, required: true },
  folderNo: { type: String, required: true, unique:true  },
  minQty: { type: Number, required: true },
  hsn: { type:String, required: true },
  sales: { type: String, required: true },
  tax: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);