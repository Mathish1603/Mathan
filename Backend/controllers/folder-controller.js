const Folder = require('../models/folder-model');

// POST - Create Folder
exports.createFolder = async (req, res) => {
  try {
    const { folderName, folderNo, product, productDetail, minQty, hsn, tax, sales } = req.body;

    const newFolder = new Folder({
      folderName,
      folderNo,
      product,
      productDetail,
      minQty,
      hsn,
      tax,
      sales
    });

    const savedData = await newFolder.save();

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: savedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating folder',
      error: error.message
    });
  }
};
// GET by folderNo
exports.getFolderByNo = async (req, res) => {
  try {
    const { folderNo } = req.params;

    const data = await Folder.findOne({ folderNo });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
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
      message: 'Error fetching folder',
      error: error.message
    });
  }
};
// GET by folderName
exports.getFolderByName = async (req, res) => {
  try {
    const { folderName } = req.params;

    const data = await Folder.findOne({ folderName });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
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
      message: 'Error fetching folder by name',
      error: error.message
    });
  }
};


// UPDATE by folderNo
exports.updateFolderByNo = async (req, res) => {
  try {
    const { folderNo } = req.params;

    const updated = await Folder.findOneAndUpdate(
      { folderNo },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    res.json({
      success: true,
      message: 'Folder updated successfully',
      data: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating folder',
      error: error.message
    });
  }
};