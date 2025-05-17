const express = require('express');
const router = express.Router();
const staffDetailController = require('../controllers/staffDetailController');

// Create or update
router.post('/', staffDetailController.createOrUpdateStaffDetail);

// Get all
router.get('/', staffDetailController.getAllStaffDetails);

// Get by className
router.get('/class/:className', staffDetailController.getStaffDetailsByClass);

// Get by ID
router.get('/:id', staffDetailController.getStaffDetailById);

// Update by ID
router.put('/:id', staffDetailController.updateStaffDetailById);

// Delete by ID
router.delete('/:id', staffDetailController.deleteStaffDetailById);

module.exports = router;
