const Doctor = require('../models/Doctor');
const User = require('../models/User');

/**
 * @desc    Get all doctors
 * @route   GET /api/doctors
 * @access  Public
 */
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    
    // Build query
    let query = {};
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email');

    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Create new doctor (Admin only)
 * @route   POST /api/doctors
 * @access  Private/Admin
 */
const createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, contact } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create user with doctor role
    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor'
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      name,
      specialization,
      experience,
      contact,
      availableSlots: []
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Update doctor available slots
 * @route   PUT /api/doctors/:id/slots
 * @access  Private/Doctor/Admin
 */
const updateDoctorSlots = async (req, res) => {
  try {
    const { availableSlots } = req.body;

    if (!Array.isArray(availableSlots)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Available slots must be an array' 
      });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    // Check authorization: only the doctor themselves or admin can update
    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this doctor' 
      });
    }

    doctor.availableSlots = availableSlots;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Available slots updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update doctor slots error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Delete doctor
 * @route   DELETE /api/doctors/:id
 * @access  Private/Admin
 */
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    // Delete associated user account
    await User.findByIdAndDelete(doctor.userId);
    
    // Delete doctor profile
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorSlots,
  deleteDoctor
};
