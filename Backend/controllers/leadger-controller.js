const Leadger = require('../models/leadger-model');

// ================= CREATE (POST) =================
exports.createLeadger = async (req, res) => {
  try {
    const savedData = await Leadger.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Leadger created successfully',
      data: savedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating leadger',
      error: error.message
    });
  }
};

exports.getLeadgerBySupplier = async (req, res) => {
  try {

    const { supplier } = req.params;

    const data = await Leadger.findOne({ supplier });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Leadger not found'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leadger',
      error: error.message
    });
  }
};

exports.updateLeadgerBySupplier = async (req, res) => {
  try {

    const { supplier } = req.params;

    const updated = await Leadger.findOneAndUpdate(
      { supplier },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leadger not found'
      });
    }

    res.json({
      success: true,
      message: 'Leadger updated successfully',
      data: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating leadger',
      error: error.message
    });
  }
};