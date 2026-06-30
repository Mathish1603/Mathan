const express = require('express');
const router = express.Router();

const {
  createIncome,
  getIncomeBySupplier,
  updateIncome,
  deleteIncome,
  getAllIncome
} = require('../controllers/income-controller');

router.post('/add', createIncome);
router.get('/supplier/:supplier', getIncomeBySupplier);
router.put('/update/:supplier', updateIncome);
router.delete('/delete/:supplier', deleteIncome);
router.get('/all', getAllIncome);

module.exports = router;