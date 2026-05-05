/**
 * Create Test Medical Records
 * This script creates sample medical records for testing
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MedicalRecord = require('../src/models/MedicalRecord');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Appointment = require('../src/models/Appointment');

const createTestMedicalRecords = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find a patient
    console.log('👤 Finding patient...');
    const patient = await User.findOne({ role: 'patient' });
    if (!patient) {
      console.log('❌ No patient found. Please register a patient first.');
      return;
    }
    console.log(`✅ Found patient: ${patient.name} (${patient.email})\n`);

    // Find a doctor
    console.log('👨‍⚕️ Finding doctor...');
    const doctor = await Doctor.findOne();
    if (!doctor) {
      console.log('❌ No doctor found. Please add a doctor first.');
      return;
    }
    console.log(`✅ Found doctor: ${doctor.name} (${doctor.specialization})\n`);

    // Find an appointment (optional)
    const appointment = await Appointment.findOne({ 
      patientId: patient._id,
      status: 'completed'
    });

    // Create multiple medical records
    console.log('📋 Creating medical records...\n');

    const records = [
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment?._id,
        type: 'prescription',
        title: 'Prescription for Viral Fever',
        description: 'Prescribed Paracetamol and Ibuprofen for fever and body ache. Patient advised to rest and stay hydrated.',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment?._id,
        type: 'lab_report',
        title: 'Complete Blood Count (CBC)',
        description: 'Blood test results showing normal hemoglobin levels (14.5 g/dL), WBC count within normal range (7,500/μL), and platelet count normal (250,000/μL).',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment?._id,
        type: 'diagnosis',
        title: 'Diagnosis: Seasonal Allergic Rhinitis',
        description: 'Patient presents with sneezing, runny nose, and itchy eyes. Diagnosed with seasonal allergic rhinitis. Prescribed antihistamines and advised to avoid allergens.',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        type: 'lab_report',
        title: 'Lipid Profile Test',
        description: 'Cholesterol levels: Total - 180 mg/dL (Normal), LDL - 100 mg/dL (Optimal), HDL - 55 mg/dL (Good), Triglycerides - 120 mg/dL (Normal). Overall cardiovascular health is good.',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        type: 'diagnosis',
        title: 'Annual Health Checkup',
        description: 'Routine annual checkup completed. Blood pressure: 120/80 mmHg (Normal), Heart rate: 72 bpm (Normal), BMI: 23.5 (Normal weight). Patient is in good health. Advised to maintain healthy lifestyle.',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        type: 'document',
        title: 'Vaccination Record - COVID-19',
        description: 'COVID-19 vaccination completed. First dose: Jan 15, 2025. Second dose: Feb 15, 2025. Booster: Aug 15, 2025. No adverse reactions reported.',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        type: 'lab_report',
        title: 'Blood Sugar Test (Fasting)',
        description: 'Fasting blood glucose: 92 mg/dL (Normal range: 70-100 mg/dL). No signs of diabetes. Patient advised to maintain healthy diet and regular exercise.',
        documents: []
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        type: 'diagnosis',
        title: 'Follow-up: Viral Fever Recovery',
        description: 'Patient has fully recovered from viral fever. Temperature normal (98.6°F), no body ache, appetite restored. Advised to continue healthy diet and adequate rest.',
        documents: []
      }
    ];

    const createdRecords = await MedicalRecord.insertMany(records);
    console.log(`✅ Created ${createdRecords.length} medical records!\n`);

    // Display summary
    console.log('📊 Medical Records Summary:');
    console.log(`   Patient: ${patient.name}`);
    console.log(`   Doctor: ${doctor.name}`);
    console.log(`   Total Records: ${createdRecords.length}\n`);

    console.log('📋 Records by Type:');
    const types = {};
    createdRecords.forEach(record => {
      types[record.type] = (types[record.type] || 0) + 1;
    });
    Object.entries(types).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count} record(s)`);
    });

    console.log('\n📝 Record Details:');
    createdRecords.forEach((record, index) => {
      console.log(`\n   ${index + 1}. ${record.title}`);
      console.log(`      Type: ${record.type}`);
      console.log(`      Date: ${record.createdAt.toLocaleDateString()}`);
      console.log(`      Description: ${record.description.substring(0, 80)}...`);
    });

    console.log('\n✅ Test medical records created successfully!');
    console.log('\n📱 You can now view these records in the patient dashboard:');
    console.log(`   1. Login as patient: ${patient.email}`);
    console.log(`   2. Click "📋 Medical Records" button`);
    console.log(`   3. View all ${createdRecords.length} medical records`);

  } catch (error) {
    console.error('❌ Error creating medical records:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run script
createTestMedicalRecords();
