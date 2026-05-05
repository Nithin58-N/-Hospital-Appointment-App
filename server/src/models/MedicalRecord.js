const mongoose = require('mongoose');

/**
 * Medical Record Model
 * Stores patient medical documents and history
 */
const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: false
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  type: {
    type: String,
    enum: ['prescription', 'lab_report', 'diagnosis', 'document', 'other'],
    required: [true, 'Record type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  fileUrl: {
    type: String,
    required: false
  },
  fileName: {
    type: String,
    required: false
  },
  fileType: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Indexes
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ type: 1 });

// Clear any existing model
if (mongoose.models.MedicalRecord) {
  delete mongoose.models.MedicalRecord;
}

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
