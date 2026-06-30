const express = require('express');
const router = express.Router();

const {
  createExpense,
  getExpenseBySupplier,
  updateExpense
} = require('../controllers/expense-controller');

router.post('/add', createExpense);
router.get('/search', getExpenseBySupplier);
router.put('/update/:supplier', updateExpense);

module.exports = router;