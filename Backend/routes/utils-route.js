const express = require('express');
const router = express.Router();
const { getDistinct } = require('../controllers/utils-controller');

router.get('/distinct/:model/:field', getDistinct);

module.exports = router;
