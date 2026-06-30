const Expense = require('../models/expense-model');

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// CREATE
exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();

    res.status(201).json({
      success: true,
      data: savedExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET by supplier
exports.getExpenseBySupplier = async (req, res) => {
  try {
    const { supplier } = req.query;

    const expenses = await Expense.find({
      supplier: { $regex: escapeRegex(supplier), $options: 'i' }
    });

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { supplier } = req.params;

    const updatedExpense = await Expense.findOneAndUpdate(
      { supplier: { $regex: `^${escapeRegex(supplier)}$`, $options: 'i' } },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Updated successfully',
      data: updatedExpense
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};