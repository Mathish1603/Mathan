const express = require('express');
const router = express.Router();

const folderController = require('../controllers/folder-controller');

// POST API
router.post('/add', folderController.createFolder);
router.get('/name/:folderName', folderController.getFolderByName);
router.get('/:folderNo', folderController.getFolderByNo);
router.put('/:folderNo', folderController.updateFolderByNo);

module.exports = router;