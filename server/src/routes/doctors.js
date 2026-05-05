const express = require('express');
const { body } = require('express-validator');
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorSlots,
  deleteDoctor
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors
 * @access  Public
 */
router.get('/', getAllDoctors);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor
 * @access  Public
 */
router.get('/:id', getDoctorById);

/**
 * @route   POST /api/doctors
 * @desc    Create new doctor (Admin only)
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('specialization')
      .trim()
      .notEmpty().withMessage('Specialization is required'),
    body('experience')
      .notEmpty().withMessage('Experience is required')
      .isInt({ min: 0, max: 60 }).withMessage('Experience must be between 0 and 60 years'),
    body('contact')
      .notEmpty().withMessage('Contact is required')
      .matches(/^[0-9]{10}$/).withMessage('Contact must be a 10-digit number'),
    validate
  ],
  createDoctor
);

/**
 * @route   PUT /api/doctors/:id/slots
 * @desc    Update doctor available slots
 * @access  Private/Doctor/Admin
 */
router.put(
  '/:id/slots',
  protect,
  authorize('doctor', 'admin'),
  [
    body('availableSlots')
      .isArray().withMessage('Available slots must be an array')
      .custom((slots) => {
        return slots.every(slot => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot));
      }).withMessage('All slots must be in HH:MM format'),
    validate
  ],
  updateDoctorSlots
);

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Delete doctor
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
