const express = require('express');
const router = express.Router();

const {
  createExpense,
  getExpenseBySupplier,
  getExpenseByReferenceNo,
  updateExpense,
  updateExpenseByReferenceNo
} = require('../controllers/expense-controller');

router.post('/add', createExpense);
router.get('/search', getExpenseBySupplier);
router.get('/search/ref', getExpenseByReferenceNo);
router.put('/update/:supplier', updateExpense);
router.put('/update/ref/:referenceNo', updateExpenseByReferenceNo);

module.exports = router;