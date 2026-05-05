const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllTherapists,
  approveTherapist,
  getPendingApprovals,
  getAllAppointments,
  cancelAppointment,
  getRevenueAnalytics
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Therapist/Doctor management
router.get('/therapists', getAllTherapists);
router.patch('/therapists/:id/approve', approveTherapist);
router.get('/pending-approvals', getPendingApprovals);

// Appointment management
router.get('/appointments', getAllAppointments);
router.patch('/appointments/:id/cancel', cancelAppointment);

// Revenue analytics
router.get('/revenue', getRevenueAnalytics);

module.exports = router;
