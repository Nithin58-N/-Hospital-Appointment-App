const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

/**
 * @desc    Create new medical record
 * @route   POST /api/medical-records
 * @access  Private (Doctor or Patient)
 */
const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, type, title, description, fileUrl, fileName, fileType, notes, isPrivate } = req.body;

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Only doctor or the patient themselves can create records
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create records for other patients'
      });
    }

    const medicalRecord = await MedicalRecord.create({
      patientId,
      doctorId: doctorId || req.user._id,
      appointmentId,
      type,
      title,
      description,
      fileUrl,
      fileName,
      fileType,
      notes,
      isPrivate: isPrivate || false
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: medicalRecord
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating medical record',
      error: error.message
    });
  }
};

/**
 * @desc    Get patient medical records
 * @route   GET /api/medical-records/patient/:patientId
 * @access  Private (Doctor or Patient themselves)
 */
const getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Only patient themselves or doctors can view records
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these records'
      });
    }

    const records = await MedicalRecord.find({ patientId })
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching records',
      error: error.message
    });
  }
};

/**
 * @desc    Get single medical record
 * @route   GET /api/medical-records/:id
 * @access  Private
 */
const getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date time');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && req.user._id.toString() !== record.patientId._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this record'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching record',
      error: error.message
    });
  }
};

/**
 * @desc    Update medical record
 * @route   PUT /api/medical-records/:id
 * @access  Private (Doctor only)
 */
const updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Only doctor who created it can update
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can update medical records'
      });
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating record',
      error: error.message
    });
  }
};

/**
 * @desc    Delete medical record
 * @route   DELETE /api/medical-records/:id
 * @access  Private (Doctor or Admin)
 */
const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete records'
      });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting record',
      error: error.message
    });
  }
};

module.exports = {
  createMedicalRecord,
  getPatientRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
};
