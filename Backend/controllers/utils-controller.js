const Purchase = require('../models/purchase-model');
const Expense = require('../models/expense-model');
const Income = require('../models/income-model');
const Folder = require('../models/folder-model');
const Leadger = require('../models/leadger-model');

const MODELS = {
  purchase: Purchase,
  expense: Expense,
  income: Income,
  folder: Folder,
  leadger: Leadger
};

const ALLOWED_FIELDS = {
  purchase: ['supplier', 'product', 'productDesc'],
  expense: ['supplier', 'name', 'referenceNo', 'type', 'paymentMethod'],
  income: ['supplier', 'name', 'type', 'paymentMethod'],
  folder: ['folderNo', 'folderName', 'product', 'productDetail'],
  leadger: ['supplier', 'personName', 'name']
};

exports.getDistinct = async (req, res) => {
  try {
    const { model, field } = req.params;
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};

    const Model = MODELS[model];
    if (!Model) {
      return res.status(400).json({ success: false, message: 'Invalid model' });
    }

    const allowed = ALLOWED_FIELDS[model];
    if (!allowed || !allowed.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid field' });
    }

    const data = await Model.distinct(field, filter);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
