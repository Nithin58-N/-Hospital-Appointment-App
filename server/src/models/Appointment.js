const mongoose = require('mongoose');

/**
 * Appointment Model
 * Manages appointments between patients and doctors
 */
const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        // Date should not be in the past
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  status: {
    type: String,
    enum: {
      values: ['booked', 'completed', 'cancelled'],
      message: 'Status must be booked, completed, or cancelled'
    },
    default: 'booked'
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  // Reschedule tracking
  originalDate: {
    type: Date
  },
  originalTime: {
    type: String
  },
  rescheduleCount: {
    type: Number,
    default: 0,
    min: 0,
    max: 2 // Maximum 2 reschedules allowed
  },
  rescheduleHistory: [{
    oldDate: Date,
    oldTime: String,
    newDate: Date,
    newTime: String,
    rescheduledAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Indexes for faster queries
appointmentSchema.index({ patientId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: -1 });
appointmentSchema.index({ status: 1 });

// Compound index to prevent double booking
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

// Clear any existing model
if (mongoose.models.Appointment) {
  delete mongoose.models.Appointment;
}

module.exports = mongoose.model('Appointment', appointmentSchema);
