const express = require('express');
const router = express.Router();

const { getReportBySupplier } = require('../controllers/report-controller');

router.get('/:supplier', getReportBySupplier);

module.exports = router;
