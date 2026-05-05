const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

/**
 * @desc    Create new review
 * @route   POST /api/reviews
 * @access  Private (Patient only)
 */
const createReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;

    // Only patients can create reviews
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can create reviews'
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // If appointmentId provided, verify appointment exists and is completed
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      if (appointment.patientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to review this appointment'
        });
      }

      if (appointment.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Can only review completed appointments'
        });
      }
    }

    // Create review
    const review = await Review.create({
      doctorId,
      patientId: req.user._id,
      appointmentId,
      rating,
      comment
    });

    // Update doctor's average rating
    await updateDoctorRating(doctorId);

    const populatedReview = await Review.findById(review._id)
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    
    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this appointment'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating review',
      error: error.message
    });
  }
};

/**
 * @desc    Get doctor reviews
 * @route   GET /api/reviews/doctor/:doctorId
 * @access  Public
 */
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const reviews = await Review.find({ doctorId, isReported: false })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
      error: error.message
    });
  }
};

/**
 * @desc    Get patient reviews
 * @route   GET /api/reviews/my
 * @access  Private (Patient)
 */
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
      error: error.message
    });
  }
};

/**
 * @desc    Reply to review
 * @route   PUT /api/reviews/:id/reply
 * @access  Private (Doctor only)
 */
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Verify doctor owns this review
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || doctor._id.toString() !== review.doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this review'
      });
    }

    review.reply = reply;
    review.repliedAt = Date.now();
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialization');

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error replying to review',
      error: error.message
    });
  }
};

/**
 * @desc    Report review
 * @route   PUT /api/reviews/:id/report
 * @access  Private
 */
const reportReview = async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isReported = true;
    review.reportReason = reason;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error reporting review',
      error: error.message
    });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Patient who created it or Admin)
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only patient who created it or admin can delete
    if (req.user.role !== 'admin' && review.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const doctorId = review.doctorId;
    await Review.findByIdAndDelete(req.params.id);

    // Update doctor's average rating
    await updateDoctorRating(doctorId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review',
      error: error.message
    });
  }
};

/**
 * Helper function to update doctor's average rating
 */
const updateDoctorRating = async (doctorId) => {
  try {
    const reviews = await Review.find({ doctorId, isReported: false });
    
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews
    });
  } catch (error) {
    console.error('Update doctor rating error:', error);
  }
};

module.exports = {
  createReview,
  getDoctorReviews,
  getMyReviews,
  replyToReview,
  reportReview,
  deleteReview
};
