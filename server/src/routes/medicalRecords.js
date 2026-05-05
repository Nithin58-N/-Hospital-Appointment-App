const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const {
  createMedicalRecord,
  getPatientRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} = require('../controllers/medicalRecordController');

// All routes require authentication
router.use(protect);

// Create medical record (doctor or patient)
router.post('/', createMedicalRecord);

// Get patient's medical records
router.get('/patient/:patientId', getPatientRecords);

// Get, update, delete specific record
router.route('/:id')
  .get(getMedicalRecord)
  .put(authorize('doctor', 'admin'), updateMedicalRecord)
  .delete(authorize('doctor', 'admin'), deleteMedicalRecord);

module.exports = router;
