const mongoose = require('mongoose');

/**
 * Doctor Model
 * Stores doctor-specific information
 * Linked to User model via userId
 */
const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [60, 'Experience seems invalid']
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit contact number']
  },
  availableSlots: {
    type: [String],
    default: [],
    validate: {
      validator: function(slots) {
        // Validate time format (HH:MM)
        return slots.every(slot => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot));
      },
      message: 'Slots must be in HH:MM format'
    }
  },
  // Enhanced Profile Fields
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [String],
  awards: [String],
  languages: [String],
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  consultationFees: {
    type: Number,
    min: [0, 'Consultation fees cannot be negative']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  photoGallery: [String],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for faster queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ userId: 1 });

// Clear any existing model
if (mongoose.models.Doctor) {
  delete mongoose.models.Doctor;
}

module.exports = mongoose.model('Doctor', doctorSchema);
