const AmbulanceRequest = require('../models/AmbulanceRequest');

/**
 * @desc    Create new ambulance request
 * @route   POST /api/ambulance/request
 * @access  Public
 */
exports.createAmbulanceRequest = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    // Validate required fields
    if (!name || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, phone, and location'
      });
    }

    // Create ambulance request
    const ambulanceRequest = await AmbulanceRequest.create({
      name,
      phone,
      location,
      userId: req.user ? req.user._id : null,
      status: 'pending',
      priority: 'high'
    });

    res.status(201).json({
      success: true,
      message: 'Ambulance request submitted successfully. Our team will contact you immediately.',
      data: ambulanceRequest
    });
  } catch (error) {
    console.error('Create ambulance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit ambulance request',
      error: error.message
    });
  }
};

/**
 * @desc    Get all ambulance requests (Admin only)
 * @route   GET /api/ambulance/requests
 * @access  Private/Admin
 */
exports.getAllAmbulanceRequests = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 50 } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search by name or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await AmbulanceRequest.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AmbulanceRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: requests,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get ambulance requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ambulance requests',
      error: error.message
    });
  }
};

/**
 * @desc    Get single ambulance request
 * @route   GET /api/ambulance/requests/:id
 * @access  Private/Admin
 */
exports.getAmbulanceRequest = async (req, res) => {
  try {
    const request = await AmbulanceRequest.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get ambulance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ambulance request',
      error: error.message
    });
  }
};

/**
 * @desc    Update ambulance request status
 * @route   PATCH /api/ambulance/requests/:id/status
 * @access  Private/Admin
 */
exports.updateAmbulanceStatus = async (req, res) => {
  try {
    const { status, ambulanceNumber, driverName, driverPhone, estimatedArrival, notes } = req.body;

    const updateData = { status };

    // Add timestamp based on status
    if (status === 'dispatched') {
      updateData.dispatchedAt = new Date();
      if (ambulanceNumber) updateData.ambulanceNumber = ambulanceNumber;
      if (driverName) updateData.driverName = driverName;
      if (driverPhone) updateData.driverPhone = driverPhone;
      if (estimatedArrival) updateData.estimatedArrival = estimatedArrival;
    } else if (status === 'arrived') {
      updateData.arrivedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    if (notes) updateData.notes = notes;

    const request = await AmbulanceRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ambulance request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Update ambulance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ambulance request',
      error: error.message
    });
  }
};

/**
 * @desc    Delete ambulance request
 * @route   DELETE /api/ambulance/requests/:id
 * @access  Private/Admin
 */
exports.deleteAmbulanceRequest = async (req, res) => {
  try {
    const request = await AmbulanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ambulance request deleted successfully'
    });
  } catch (error) {
    console.error('Delete ambulance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ambulance request',
      error: error.message
    });
  }
};

/**
 * @desc    Get ambulance request statistics
 * @route   GET /api/ambulance/stats
 * @access  Private/Admin
 */
exports.getAmbulanceStats = async (req, res) => {
  try {
    const totalRequests = await AmbulanceRequest.countDocuments();
    const pendingRequests = await AmbulanceRequest.countDocuments({ status: 'pending' });
    const dispatchedRequests = await AmbulanceRequest.countDocuments({ status: 'dispatched' });
    const completedRequests = await AmbulanceRequest.countDocuments({ status: 'completed' });
    const cancelledRequests = await AmbulanceRequest.countDocuments({ status: 'cancelled' });

    // Recent requests (last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const recentRequests = await AmbulanceRequest.countDocuments({
      createdAt: { $gte: twentyFourHoursAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        dispatchedRequests,
        completedRequests,
        cancelledRequests,
        recentRequests
      }
    });
  } catch (error) {
    console.error('Get ambulance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ambulance statistics',
      error: error.message
    });
  }
};
