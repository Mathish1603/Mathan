const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseupdate-controller');

// CREATE
router.post('/', purchaseController.createPurchase);

// UPDATE
router.put('/:addaiNo', purchaseController.updatePurchase);

// GET
router.get('/:addaiNo', purchaseController.getByAddaiNo);

// DELETE
router.delete('/:addaiNo', purchaseController.deletePurchase);

module.exports = router;