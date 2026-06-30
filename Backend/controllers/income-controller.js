const Income = require('../models/income-model');

// POST - Create Income Entry
exports.createIncome = async (req, res) => {
  try {
    const income = new Income(req.body);
    const savedIncome = await income.save();

    res.status(201).json({
      success: true,
      message: 'Income entry created successfully',
      data: savedIncome
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET by supplier
exports.getIncomeBySupplier = async (req, res) => {
  try {
    const { supplier } = req.params;

    const data = await Income.find({
      supplier: { $regex: `^${supplier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE by supplier
exports.updateIncome = async (req, res) => {
  try {
    const { supplier } = req.params;

    const updated = await Income.findOneAndUpdate(
      { supplier: { $regex: `^${supplier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Updated successfully',
      data: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE by supplier
exports.deleteIncome = async (req, res) => {
  try {
    const { supplier } = req.params;

    const deleted = await Income.findOneAndDelete({
      supplier: { $regex: `^${supplier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deleted successfully',
      data: deleted
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET all
exports.getAllIncome = async (req, res) => {
  try {
    const data = await Income.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
