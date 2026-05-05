const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

/**
 * @desc    Book new appointment
 * @route   POST /api/appointments
 * @access  Private/Patient
 */
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    // Check if slot is available
    if (!doctor.availableSlots.includes(time)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Selected time slot is not available for this doctor' 
      });
    }

    // Check if appointment already exists for this slot
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is already booked' 
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date: new Date(date),
      time,
      reason,
      status: 'booked'
    });

    // Populate details
    await appointment.populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialization' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Get patient's appointments
 * @route   GET /api/appointments/my
 * @access  Private/Patient
 */
const getMyAppointments = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    let query = { patientId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialization contact')
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Get doctor's appointments
 * @route   GET /api/appointments/doctor
 * @access  Private/Doctor
 */
const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;

    // Find doctor profile for current user
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor profile not found' 
      });
    }

    // Build query
    let query = { doctorId: doctor._id };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone dateOfBirth gender bloodGroup height weight age')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Update appointment status
 * @route   PUT /api/appointments/:id/status
 * @access  Private/Doctor/Patient
 */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['booked', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Authorization check
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const isPatient = appointment.patientId.toString() === req.user._id.toString();
    const isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this appointment' 
      });
    }

    // Business logic: only doctors can mark as completed
    if (status === 'completed' && !isDoctor && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only doctors can mark appointments as completed' 
      });
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialization' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Get all appointments (Admin only)
 * @route   GET /api/appointments
 * @access  Private/Admin
 */
const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId } = req.query;

    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (doctorId) {
      query.doctorId = doctorId;
    }
    
    if (patientId) {
      query.patientId = patientId;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone dateOfBirth gender bloodGroup height weight age')
      .populate('doctorId', 'name specialization')
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Delete appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private/Admin
 */
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @desc    Reschedule appointment
 * @route   PUT /api/appointments/:id/reschedule
 * @access  Private/Patient
 */
const rescheduleAppointment = async (req, res) => {
  try {
    const { newDate, newTime } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Only patient can reschedule
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this appointment'
      });
    }

    // Check if already cancelled or completed
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule ${appointment.status} appointment`
      });
    }

    // Check reschedule limit
    if (appointment.rescheduleCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum reschedule limit (2) reached for this appointment'
      });
    }

    // Verify doctor and slot availability
    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor.availableSlots.includes(newTime)) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available for this doctor'
      });
    }

    // Check if new slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: new Date(newDate),
      time: newTime,
      status: { $ne: 'cancelled' },
      _id: { $ne: appointment._id }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked'
      });
    }

    // Store original date/time if first reschedule
    if (appointment.rescheduleCount === 0) {
      appointment.originalDate = appointment.date;
      appointment.originalTime = appointment.time;
    }

    // Add to reschedule history
    appointment.rescheduleHistory.push({
      oldDate: appointment.date,
      oldTime: appointment.time,
      newDate: new Date(newDate),
      newTime: newTime,
      rescheduledAt: Date.now()
    });

    // Update appointment
    appointment.date = new Date(newDate);
    appointment.time = newTime;
    appointment.rescheduleCount += 1;

    await appointment.save();

    await appointment.populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialization' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get booked slots for a doctor on a specific date
 * @route   GET /api/appointments/doctor/:doctorId/booked-slots
 * @access  Private
 */
const getBookedSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Find all booked appointments for this doctor on this date (excluding cancelled)
    const appointments = await Appointment.find({
      doctorId,
      date: new Date(date),
      status: { $in: ['booked', 'completed'] } // Only booked and completed slots are unavailable
    }).select('time');

    const bookedSlots = appointments.map(apt => apt.time);

    res.status(200).json({
      success: true,
      data: {
        date,
        bookedSlots
      }
    });
  } catch (error) {
    console.error('Get booked slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  deleteAppointment,
  rescheduleAppointment,
  getBookedSlots
};
