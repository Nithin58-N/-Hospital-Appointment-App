const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const {
  createAmbulanceRequest,
  getAllAmbulanceRequests,
  getAmbulanceRequest,
  updateAmbulanceStatus,
  deleteAmbulanceRequest,
  getAmbulanceStats
} = require('../controllers/ambulanceController');

// Public route - anyone can request ambulance
router.post('/request', createAmbulanceRequest);

// Admin routes - require authentication and admin role
router.get('/requests', protect, authorize('admin'), getAllAmbulanceRequests);
router.get('/requests/:id', protect, authorize('admin'), getAmbulanceRequest);
router.patch('/requests/:id/status', protect, authorize('admin'), updateAmbulanceStatus);
router.delete('/requests/:id', protect, authorize('admin'), deleteAmbulanceRequest);
router.get('/stats', protect, authorize('admin'), getAmbulanceStats);

module.exports = router;
