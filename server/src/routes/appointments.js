const express = require('express');
const { body } = require('express-validator');
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  deleteAppointment,
  rescheduleAppointment,
  getBookedSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments (Admin only)
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), getAllAppointments);

/**
 * @route   POST /api/appointments
 * @desc    Book new appointment
 * @access  Private/Patient
 */
router.post(
  '/',
  protect,
  authorize('patient'),
  [
    body('doctorId')
      .notEmpty().withMessage('Doctor ID is required')
      .isMongoId().withMessage('Invalid doctor ID'),
    body('date')
      .notEmpty().withMessage('Date is required')
      .isISO8601().withMessage('Invalid date format')
      .custom((value) => {
        const appointmentDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
      }).withMessage('Appointment date cannot be in the past'),
    body('time')
      .notEmpty().withMessage('Time is required')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
    body('reason')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
    validate
  ],
  bookAppointment
);

/**
 * @route   GET /api/appointments/my
 * @desc    Get patient's appointments
 * @access  Private/Patient
 */
router.get('/my', protect, authorize('patient'), getMyAppointments);

/**
 * @route   GET /api/appointments/doctor/:doctorId/booked-slots
 * @desc    Get booked time slots for a doctor on a specific date
 * @access  Private
 */
router.get('/doctor/:doctorId/booked-slots', protect, getBookedSlots);

/**
 * @route   GET /api/appointments/doctor
 * @desc    Get doctor's appointments
 * @access  Private/Doctor
 */
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);

/**
 * @route   PUT /api/appointments/:id/status
 * @desc    Update appointment status
 * @access  Private/Doctor/Patient/Admin
 */
router.put(
  '/:id/status',
  protect,
  [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['booked', 'completed', 'cancelled']).withMessage('Invalid status value'),
    validate
  ],
  updateAppointmentStatus
);

/**
 * @route   PUT /api/appointments/:id/reschedule
 * @desc    Reschedule appointment
 * @access  Private/Patient
 */
router.put(
  '/:id/reschedule',
  protect,
  authorize('patient'),
  [
    body('newDate')
      .notEmpty().withMessage('New date is required')
      .isISO8601().withMessage('Invalid date format')
      .custom((value) => {
        const appointmentDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
      }).withMessage('New date cannot be in the past'),
    body('newTime')
      .notEmpty().withMessage('New time is required')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
    validate
  ],
  rescheduleAppointment
);

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete appointment
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;
