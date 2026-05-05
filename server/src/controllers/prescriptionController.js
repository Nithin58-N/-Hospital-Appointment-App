const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

/**
 * @desc    Create new prescription
 * @route   POST /api/prescriptions
 * @access  Private/Doctor
 */
const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, diagnosis, symptoms, notes, validityDays = 30 } = req.body;

    // Verify doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Verify patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Validate medicines
    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one medicine is required'
      });
    }

    // Calculate validity
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    // Create prescription
    const prescription = await Prescription.create({
      patientId,
      doctorId: doctor._id,
      appointmentId,
      medicines,
      diagnosis,
      symptoms,
      notes,
      status: 'active',
      validUntil
    });

    await prescription.populate([
      { path: 'patientId', select: 'name email age gender' },
      { path: 'doctorId', select: 'name specialization contact' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating prescription',
      error: error.message
    });
  }
};

/**
 * @desc    Get patient prescriptions
 * @route   GET /api/prescriptions/patient/:patientId
 * @access  Private
 */
const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    // Authorization check
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these prescriptions'
      });
    }

    let query = { patientId };
    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'name specialization contact')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching prescriptions',
      error: error.message
    });
  }
};

/**
 * @desc    Get doctor prescriptions
 * @route   GET /api/prescriptions/doctor
 * @access  Private/Doctor
 */
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const { status } = req.query;
    let query = { doctorId: doctor._id };
    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name email age gender')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    console.error('Get doctor prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching prescriptions',
      error: error.message
    });
  }
};

/**
 * @desc    Get single prescription
 * @route   GET /api/prescriptions/:id
 * @access  Private
 */
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'name email age gender dateOfBirth bloodGroup allergies')
      .populate('doctorId', 'name specialization contact experience')
      .populate('appointmentId', 'date time reason');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Authorization check
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const isPatient = req.user.role === 'patient' && prescription.patientId._id.toString() === req.user._id.toString();
    const isDoctor = doctor && prescription.doctorId._id.toString() === doctor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this prescription'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching prescription',
      error: error.message
    });
  }
};

/**
 * @desc    Finalize prescription (change from draft to active)
 * @route   POST /api/prescriptions/:id/finalize
 * @access  Private/Doctor
 */
const finalizePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Only doctor who created it can finalize
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || prescription.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to finalize this prescription'
      });
    }

    // Can only finalize draft prescriptions
    if (prescription.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only finalize draft prescriptions'
      });
    }

    // Validate prescription has required data
    if (!prescription.medicines || prescription.medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prescription must have at least one medicine'
      });
    }

    // Update status to active
    prescription.status = 'active';
    await prescription.save();

    // Create medical record entry
    const MedicalRecord = require('../models/MedicalRecord');
    await MedicalRecord.create({
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      appointmentId: prescription.appointmentId,
      type: 'prescription',
      title: `Prescription ${prescription.prescriptionId}`,
      description: prescription.diagnosis || 'Prescription issued',
      documents: []
    });

    await prescription.populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialization' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Prescription finalized successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Finalize prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error finalizing prescription',
      error: error.message
    });
  }
};

/**
 * @desc    Update prescription
 * @route   PUT /api/prescriptions/:id
 * @access  Private/Doctor
 */
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Only doctor who created it can update
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || prescription.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription'
      });
    }

    // Can only update draft prescriptions
    if (prescription.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only update draft prescriptions'
      });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialization' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: updatedPrescription
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating prescription',
      error: error.message
    });
  }
};

/**
 * @desc    Request prescription refill
 * @route   POST /api/prescriptions/:id/refill-request
 * @access  Private/Patient
 */
const requestRefill = async (req, res) => {
  try {
    const { notes } = req.body;
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Only patient can request refill
    if (prescription.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request refill for this prescription'
      });
    }

    // Check if already requested
    if (prescription.refillRequested) {
      return res.status(400).json({
        success: false,
        message: 'Refill already requested for this prescription'
      });
    }

    // Check if expired
    if (prescription.status === 'expired') {
      return res.status(400).json({
        success: false,
        message: 'Cannot request refill for expired prescription'
      });
    }

    prescription.refillRequested = true;
    prescription.refillNotes = notes;
    prescription.refillRequestedAt = Date.now();
    await prescription.save();

    res.status(200).json({
      success: true,
      message: 'Refill request submitted successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Request refill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error requesting refill',
      error: error.message
    });
  }
};

/**
 * @desc    Approve prescription refill
 * @route   POST /api/prescriptions/:id/refill-approve
 * @access  Private/Doctor
 */
const approveRefill = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || prescription.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this refill'
      });
    }

    if (!prescription.refillRequested) {
      return res.status(400).json({
        success: false,
        message: 'No refill request found for this prescription'
      });
    }

    // Create new prescription based on original
    const newPrescription = await Prescription.create({
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicines: prescription.medicines,
      diagnosis: prescription.diagnosis,
      symptoms: prescription.symptoms,
      notes: `Refill of prescription ${prescription.prescriptionId}`,
      status: 'active',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Update original prescription
    prescription.refillApprovedBy = doctor._id;
    prescription.refillApprovedAt = Date.now();
    await prescription.save();

    await newPrescription.populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialization' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Refill approved and new prescription created',
      data: newPrescription
    });
  } catch (error) {
    console.error('Approve refill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving refill',
      error: error.message
    });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescription,
  updatePrescription,
  finalizePrescription,
  requestRefill,
  approveRefill
};
