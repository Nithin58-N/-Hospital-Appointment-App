const mongoose = require('mongoose');

/**
 * Medicine Model
 * Database of medicines for prescription creation
 */
const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    unique: true
  },
  genericName: {
    type: String,
    required: [true, 'Generic name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Antibiotic',
      'Painkiller',
      'Antiviral',
      'Antifungal',
      'Antihistamine',
      'Antacid',
      'Vitamin',
      'Supplement',
      'Cardiovascular',
      'Diabetes',
      'Respiratory',
      'Gastrointestinal',
      'Neurological',
      'Other'
    ]
  },
  manufacturer: {
    type: String,
    trim: true
  },
  strength: [{
    type: String,
    required: true
  }],
  form: {
    type: String,
    required: true,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'gel', 'drops', 'inhaler', 'powder']
  },
  commonDosages: [String],
  commonFrequencies: [String],
  commonDurations: [String],
  sideEffects: [String],
  contraindications: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for search
medicineSchema.index({ name: 'text', genericName: 'text' });
medicineSchema.index({ category: 1 });
medicineSchema.index({ isActive: 1 });

// Clear any existing model
if (mongoose.models.Medicine) {
  delete mongoose.models.Medicine;
}

module.exports = mongoose.model('Medicine', medicineSchema);
