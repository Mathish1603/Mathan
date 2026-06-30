const express = require('express');
const router = express.Router();
const controller = require('../controllers/leadger-controller');

// CREATE
router.post('/add-account', controller.createLeadger);

// GET BY SUPPLIER
router.get('/supplier/:supplier', controller.getLeadgerBySupplier);

// UPDATE BY SUPPLIER
router.put('/supplier/:supplier', controller.updateLeadgerBySupplier);

module.exports = router;