const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
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
    body('role')
      .optional()
      .isIn(['admin', 'doctor', 'patient']).withMessage('Invalid role'),
    body('specialization')
      .if(body('role').equals('doctor'))
      .notEmpty().withMessage('Specialization is required for doctors'),
    body('experience')
      .if(body('role').equals('doctor'))
      .notEmpty().withMessage('Experience is required for doctors')
      .isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    body('contact')
      .if(body('role').equals('doctor'))
      .notEmpty().withMessage('Contact is required for doctors')
      .matches(/^[0-9]{10}$/).withMessage('Contact must be a 10-digit number'),
    validate
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    validate
  ],
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .optional()
      .matches(/^[0-9]{10}$/).withMessage('Phone must be a 10-digit number'),
    body('dateOfBirth')
      .optional()
      .isISO8601().withMessage('Invalid date format'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other', '']).withMessage('Invalid gender'),
    body('bloodGroup')
      .optional()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).withMessage('Invalid blood group'),
    body('height')
      .optional()
      .isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
    body('weight')
      .optional()
      .isFloat({ min: 1, max: 500 }).withMessage('Weight must be between 1 and 500 kg'),
    validate
  ],
  updateProfile
);

module.exports = router;
