const PurchaseUpdate = require('../models/purchaseupdate-model');

// CREATE
exports.createPurchase = async (req, res) => {
  try {
    const purchase = new PurchaseUpdate(req.body);
    const savedData = await purchase.save();

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: savedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET by addaiNo
exports.getByAddaiNo = async (req, res) => {
  try {
    const addaiNo = Number(req.params.addaiNo);

    const data = await PurchaseUpdate.findOne({ addaiNo });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE
exports.deletePurchase = async (req, res) => {
  try {
    const addaiNo = Number(req.params.addaiNo);

    const deleted = await PurchaseUpdate.findOneAndDelete({ addaiNo });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
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


// UPDATE
exports.updatePurchase = async (req, res) => {
  try {
    const addaiNo = Number(req.params.addaiNo);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update"
      });
    }

    const updatedData = await PurchaseUpdate.findOneAndUpdate(
      { addaiNo: addaiNo },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: updatedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};