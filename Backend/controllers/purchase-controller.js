const Purchase = require('../models/purchase-model');

// ================= CREATE =================
exports.createPurchase = async (req, res) => {
  try {
    const saved = await Purchase.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Purchase saved successfully',
      data: saved
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= GET ALL =================
exports.getAllPurchases = async (req, res) => {
  try {
    const data = await Purchase.find().sort({ createdAt: -1 });

    res.json({
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


// ================= GET SUPPLIERS =================
exports.getSuppliers = async (req, res) => {
  try {
    const data = await Purchase.distinct('supplier');

    res.json({
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


// ================= GET BY SUPPLIER =================
exports.getBySupplier = async (req, res) => {
  try {
    const supplier = req.params.supplier;

    const data = await Purchase.find({
      supplier: { $regex: `^${supplier}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    // ✅ FIX: return empty array instead of 404
    if (!data || data.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= GET BY FOLDER NO =================
exports.getByFolderNo = async (req, res) => {
  try {
    const folderNo = req.params.folderNo;

    if (!folderNo || folderNo.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder number'
      });
    }

    const data = await Purchase.find({
      // ✅ You can use direct match OR regex
      // folderNo: folderNo.trim()
      folderNo: { $regex: `^${folderNo.trim()}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    // ✅ FIX: return empty array instead of 404
    if (!data || data.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error("🔥 ERROR getByFolderNo:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET BY PRODUCT =================
// ================= GET BY PRODUCT =================

// ✅ Escape regex special characters
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

exports.getByProduct = async (req, res) => {
  try {
    // ✅ Decode URL (important for values like F-T1, spaces, etc.)
    const product = decodeURIComponent(req.params.product);

    // ✅ Prevent regex breaking
    const safeProduct = escapeRegex(product);

    const data = await Purchase.find({
      product: { $regex: `^${safeProduct}$`, $options: 'i' } // case-insensitive exact match
    });

    // ✅ Always return response (avoid undefined)
    return res.json({
      success: true,
      count: data.length,
      data: data || []
    });

  } catch (err) {
    console.error("🔥 ERROR getByProduct:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= UPDATE BY PRODUCT (LATEST) =================
exports.updateByProduct = async (req, res) => {
  try {
    const product = req.params.product;

    const safeProduct = escapeRegex(product); // ✅ FIX

    const updated = await Purchase.findOneAndUpdate(
      {
        product: { $regex: `^${safeProduct}$`, $options: 'i' }
      },
      req.body,
      {
        new: true,
        sort: { createdAt: -1 },
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'No purchase found for this product'
      });
    }

    res.json({
      success: true,
      message: 'Updated successfully (latest record)',
      data: updated
    });

  } catch (error) {
    console.error("🔥 ERROR updateByProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE ALL BY PRODUCT =================
exports.updateAllByProduct = async (req, res) => {
  try {
    const product = req.params.product;

    const safeProduct = escapeRegex(product); // ✅ FIX

    const updated = await Purchase.updateMany(
      {
        product: { $regex: `^${safeProduct}$`, $options: 'i' }
      },
      req.body
    );

    res.json({
      success: true,
      message: 'All matching product records updated',
      data: updated
    });

  } catch (error) {
    console.error("🔥 ERROR updateAllByProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};