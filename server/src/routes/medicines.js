const express = require('express');
const { body } = require('express-validator');
const {
  searchMedicines,
  getAllMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/medicines/search
 * @desc    Search medicines
 * @access  Private
 */
router.get('/search', searchMedicines);

/**
 * @route   GET /api/medicines
 * @desc    Get all medicines
 * @access  Private
 */
router.get('/', getAllMedicines);

/**
 * @route   GET /api/medicines/:id
 * @desc    Get single medicine
 * @access  Private
 */
router.get('/:id', getMedicine);

/**
 * @route   POST /api/medicines
 * @desc    Create medicine
 * @access  Private/Admin
 */
router.post(
  '/',
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Medicine name is required').trim(),
    body('genericName').notEmpty().withMessage('Generic name is required').trim(),
    body('category').notEmpty().withMessage('Category is required'),
    body('strength').isArray({ min: 1 }).withMessage('At least one strength is required'),
    body('form').notEmpty().withMessage('Form is required'),
    validate
  ],
  createMedicine
);

/**
 * @route   PUT /api/medicines/:id
 * @desc    Update medicine
 * @access  Private/Admin
 */
router.put('/:id', authorize('admin'), updateMedicine);

/**
 * @route   DELETE /api/medicines/:id
 * @desc    Delete medicine (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', authorize('admin'), deleteMedicine);

module.exports = router;
