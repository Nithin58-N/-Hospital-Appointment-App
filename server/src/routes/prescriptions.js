const express = require('express');
const { body } = require('express-validator');
const {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescription,
  updatePrescription,
  finalizePrescription,
  requestRefill,
  approveRefill
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/prescriptions
 * @desc    Create new prescription
 * @access  Private/Doctor
 */
router.post(
  '/',
  authorize('doctor'),
  [
    body('patientId').notEmpty().withMessage('Patient ID is required').isMongoId().withMessage('Invalid patient ID'),
    body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
    body('medicines.*.medicineName').notEmpty().withMessage('Medicine name is required'),
    body('medicines.*.dosage').notEmpty().withMessage('Dosage is required'),
    body('medicines.*.frequency').notEmpty().withMessage('Frequency is required'),
    body('medicines.*.duration').notEmpty().withMessage('Duration is required'),
    body('medicines.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate
  ],
  createPrescription
);

/**
 * @route   GET /api/prescriptions/patient/:patientId
 * @desc    Get patient prescriptions
 * @access  Private
 */
router.get('/patient/:patientId', getPatientPrescriptions);

/**
 * @route   GET /api/prescriptions/doctor
 * @desc    Get doctor prescriptions
 * @access  Private/Doctor
 */
router.get('/doctor', authorize('doctor'), getDoctorPrescriptions);

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get single prescription
 * @access  Private
 */
router.get('/:id', getPrescription);

/**
 * @route   PUT /api/prescriptions/:id
 * @desc    Update prescription
 * @access  Private/Doctor
 */
router.put('/:id', authorize('doctor'), updatePrescription);

/**
 * @route   POST /api/prescriptions/:id/finalize
 * @desc    Finalize prescription (change from draft to active)
 * @access  Private/Doctor
 */
router.post('/:id/finalize', authorize('doctor'), finalizePrescription);

/**
 * @route   POST /api/prescriptions/:id/refill-request
 * @desc    Request prescription refill
 * @access  Private/Patient
 */
router.post(
  '/:id/refill-request',
  authorize('patient'),
  [
    body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
    validate
  ],
  requestRefill
);

/**
 * @route   POST /api/prescriptions/:id/refill-approve
 * @desc    Approve prescription refill
 * @access  Private/Doctor
 */
router.post('/:id/refill-approve', authorize('doctor'), approveRefill);

module.exports = router;
