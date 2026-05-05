const mongoose = require('mongoose');

/**
 * Prescription Model
 * Digital prescriptions created by doctors for patients
 */
const prescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    unique: true
  },
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  medicines: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medicineName: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      type: String,
      required: true
    },
    strength: String,
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    instructions: String
  }],
  
  diagnosis: {
    type: String,
    trim: true,
    maxlength: [500, 'Diagnosis cannot exceed 500 characters']
  },
  symptoms: [String],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'cancelled'],
    default: 'draft'
  },
  validUntil: {
    type: Date,
    required: true
  },
  
  refillRequested: {
    type: Boolean,
    default: false
  },
  refillNotes: String,
  refillRequestedAt: Date,
  refillApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  refillApprovedAt: Date
}, {
  timestamps: true
});

// Generate prescription ID before saving
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionId = `RX-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Instance methods
prescriptionSchema.methods.isExpired = function() {
  return this.validUntil < new Date();
};

prescriptionSchema.methods.canRequestRefill = function() {
  // Can request refill if:
  // 1. Status is active
  // 2. Not already requested
  // 3. Within 3 days of expiry
  if (this.status !== 'active' || this.refillRequested) {
    return false;
  }
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  return this.validUntil <= threeDaysFromNow;
};

// Indexes
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ prescriptionId: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ validUntil: 1 });

// Clear any existing model
if (mongoose.models.Prescription) {
  delete mongoose.models.Prescription;
}

module.exports = mongoose.model('Prescription', prescriptionSchema);
