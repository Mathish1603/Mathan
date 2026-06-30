const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase-controller');


router.post('/add', purchaseController.createPurchase);


router.get('/', purchaseController.getAllPurchases);


router.get('/suppliers/list', purchaseController.getSuppliers);

router.get('/supplier/:supplier', purchaseController.getBySupplier);

router.get('/product/:product', purchaseController.getByProduct);

router.get('/folder/:folderNo', purchaseController.getByFolderNo);

router.put('/product/all/:product', purchaseController.updateAllByProduct);

router.put('/product/:product', purchaseController.updateByProduct);


module.exports = router;