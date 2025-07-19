const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/OwnerController');

// POST: Set the day's menu
router.post('/set-menu', ownerController.setMenu);

// GET: Get the latest menu
router.get('/get-menu', ownerController.getMenu);

module.exports = router; 
