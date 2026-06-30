const Register = require('../models/report-model');
const Leadger = require('../models/leadger-model');
const Purchase = require('../models/purchase-model');
const Expense = require('../models/expense-model');

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

exports.getReportBySupplier = async (req, res) => {
  try {
    const { supplier } = req.params;
    const safeSupplier = escapeRegex(supplier);

    const leadger = await Leadger.findOne({
      supplier: { $regex: `^${safeSupplier}$`, $options: 'i' }
    });

    const purchase = await Purchase.find({
      supplier: { $regex: `^${safeSupplier}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    const expense = await Expense.find({
      supplier: { $regex: `^${safeSupplier}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      leadger: leadger || null,
      purchase: purchase || [],
      expense: expense || []
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
