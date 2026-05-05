const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const AmbulanceRequest = require('../models/AmbulanceRequest');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getAdminStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    // Users by role
    const patients = await User.countDocuments({ role: 'patient' });
    const doctors = await User.countDocuments({ role: 'doctor' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    // Appointments by status
    const bookedAppointments = await Appointment.countDocuments({ status: 'booked' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    
    // Pending approvals (doctors without approval status or pending)
    const pendingApprovals = await Doctor.countDocuments({ 
      $or: [
        { isApproved: false },
        { isApproved: { $exists: false } }
      ]
    });
    
    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.find({ createdAt: { $gte: sevenDaysAgo } })
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Monthly user growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyGrowth = await User.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Calculate total revenue (assuming consultation fee from appointments)
    const revenueData = await Appointment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$doctor.consultationFee' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const paidSessions = revenueData.length > 0 ? revenueData[0].count : 0;
    const averagePerSession = paidSessions > 0 ? totalRevenue / paidSessions : 0;

    // Ambulance request statistics
    const totalAmbulanceRequests = await AmbulanceRequest.countDocuments();
    const pendingAmbulanceRequests = await AmbulanceRequest.countDocuments({ status: 'pending' });
    const dispatchedAmbulanceRequests = await AmbulanceRequest.countDocuments({ status: 'dispatched' });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDoctors,
          totalAppointments,
          totalRevenue,
          pendingApprovals,
          onlineUsers: 0, // Would need socket.io or session tracking
          totalAmbulanceRequests,
          pendingAmbulanceRequests,
          dispatchedAmbulanceRequests
        },
        usersByRole: {
          patients,
          doctors,
          admins
        },
        appointmentsByStatus: {
          booked: bookedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments
        },
        revenue: {
          total: totalRevenue,
          paidSessions,
          averagePerSession
        },
        recentRegistrations: recentUsers,
        monthlyGrowth
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by status
    if (status) {
      query.isActive = status === 'active';
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update user status (activate/deactivate)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private/Admin
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If user is a doctor, also delete doctor profile
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ userId: req.params.id });
    }
    
    // Delete user's appointments
    await Appointment.deleteMany({
      $or: [
        { patientId: req.params.id },
        { doctorId: req.params.id }
      ]
    });
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all therapists/doctors with filters
 * @route   GET /api/admin/therapists
 * @access  Private/Admin
 */
exports.getAllTherapists = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Search by name or specialization
    if (search) {
      const users = await User.find({
        role: 'doctor',
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      
      query.$or = [
        { userId: { $in: userIds } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by approval status
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.$or = [
        { isApproved: false },
        { isApproved: { $exists: false } }
      ];
    }
    
    const doctors = await Doctor.find(query)
      .populate('userId', 'name email createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Doctor.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: doctors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all therapists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Approve/reject therapist
 * @route   PATCH /api/admin/therapists/:id/approve
 * @access  Private/Admin
 */
exports.approveTherapist = async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor,
      message: `Therapist ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Approve therapist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get pending therapist approvals
 * @route   GET /api/admin/pending-approvals
 * @access  Private/Admin
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({
      $or: [
        { isApproved: false },
        { isApproved: { $exists: false } }
      ]
    })
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: pendingDoctors,
      count: pendingDoctors.length
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all appointments with filters
 * @route   GET /api/admin/appointments
 * @access  Private/Admin
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Search by patient or doctor name
    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      
      query.$or = [
        { patientId: { $in: userIds } },
        { doctorId: { $in: userIds } }
      ];
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization consultationFee')
      .sort({ date: -1, time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Appointment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: appointments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
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
 * @desc    Cancel appointment
 * @route   PATCH /api/admin/appointments/:id/cancel
 * @access  Private/Admin
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get revenue analytics
 * @route   GET /api/admin/revenue
 * @access  Private/Admin
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    // Total revenue from completed appointments
    const revenueData = await Appointment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$doctor.consultationFee' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const paidSessions = revenueData.length > 0 ? revenueData[0].count : 0;
    const averagePerSession = paidSessions > 0 ? totalRevenue / paidSessions : 0;
    
    // Active therapists (with at least one completed appointment)
    const activeTherapists = await Appointment.distinct('doctorId', { status: 'completed' });
    
    // Monthly revenue (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          date: { $gte: twelveMonthsAgo }
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          revenue: { $sum: '$doctor.consultationFee' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Top therapists by revenue
    const topTherapists = await Appointment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $group: {
          _id: '$doctorId',
          doctorName: { $first: '$doctor.name' },
          specialization: { $first: '$doctor.specialization' },
          totalRevenue: { $sum: '$doctor.consultationFee' },
          sessionCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          paidSessions,
          averagePerSession,
          activeTherapists: activeTherapists.length
        },
        monthlyRevenue,
        topTherapists
      }
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
