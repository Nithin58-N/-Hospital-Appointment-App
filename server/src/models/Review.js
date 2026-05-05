const mongoose = require('mongoose');

/**
 * Review Model
 * Patient reviews and ratings for doctors
 */
const reviewSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  reply: {
    type: String,
    trim: true,
    maxlength: [500, 'Reply cannot exceed 500 characters']
  },
  repliedAt: {
    type: Date
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

// Indexes
reviewSchema.index({ doctorId: 1, createdAt: -1 });
reviewSchema.index({ patientId: 1 });
reviewSchema.index({ rating: 1 });

// Prevent duplicate reviews for same appointment
reviewSchema.index({ doctorId: 1, patientId: 1, appointmentId: 1 }, { unique: true, sparse: true });

// Clear any existing model
if (mongoose.models.Review) {
  delete mongoose.models.Review;
}

module.exports = mongoose.model('Review', reviewSchema);
