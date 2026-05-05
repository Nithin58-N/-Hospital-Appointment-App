const mongoose = require('mongoose');

/**
 * Ambulance Request Model
 * Stores emergency ambulance service requests
 */
const ambulanceRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  location: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be null for non-logged-in users
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'arrived', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  ambulanceNumber: {
    type: String,
    default: ''
  },
  driverName: {
    type: String,
    default: ''
  },
  driverPhone: {
    type: String,
    default: ''
  },
  estimatedArrival: {
    type: Date
  },
  dispatchedAt: {
    type: Date
  },
  arrivedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
ambulanceRequestSchema.index({ status: 1, createdAt: -1 });
ambulanceRequestSchema.index({ phone: 1 });

module.exports = mongoose.model('AmbulanceRequest', ambulanceRequestSchema);
