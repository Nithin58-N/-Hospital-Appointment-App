/**
 * Create a Test Prescription
 * This script creates a sample prescription for testing
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Prescription = require('../src/models/Prescription');
const Medicine = require('../src/models/Medicine');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');

const createTestPrescription = async () => {
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

    // Find some medicines
    console.log('💊 Finding medicines...');
    const paracetamol = await Medicine.findOne({ name: 'Paracetamol' });
    const ibuprofen = await Medicine.findOne({ name: 'Ibuprofen' });
    
    if (!paracetamol || !ibuprofen) {
      console.log('❌ Medicines not found. Running seed script...');
      const { execSync } = require('child_process');
      execSync('node scripts/seedMedicines.js', { cwd: __dirname + '/..' });
      console.log('✅ Medicines seeded. Please run this script again.\n');
      return;
    }
    console.log(`✅ Found medicines: ${paracetamol.name}, ${ibuprofen.name}\n`);

    // Create prescription
    console.log('📝 Creating prescription...');
    const prescription = await Prescription.create({
      patientId: patient._id,
      doctorId: doctor._id,
      medicines: [
        {
          medicineId: paracetamol._id,
          medicineName: paracetamol.name,
          genericName: paracetamol.genericName,
          dosage: '1 tablet',
          strength: '500mg',
          frequency: 'Three times daily',
          duration: '5 days',
          quantity: 15,
          instructions: 'Take after meals with water'
        },
        {
          medicineId: ibuprofen._id,
          medicineName: ibuprofen.name,
          genericName: ibuprofen.genericName,
          dosage: '1 tablet',
          strength: '400mg',
          frequency: 'Twice daily',
          duration: '3 days',
          quantity: 6,
          instructions: 'Take with food to avoid stomach upset'
        }
      ],
      diagnosis: 'Viral fever with body ache',
      symptoms: ['fever', 'headache', 'body pain', 'fatigue'],
      notes: 'Rest for 3-5 days. Drink plenty of fluids. Return if fever persists beyond 5 days.',
      status: 'active',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await prescription.populate([
      { path: 'patientId', select: 'name email age gender' },
      { path: 'doctorId', select: 'name specialization contact' }
    ]);

    console.log('✅ Prescription created successfully!\n');
    console.log('📋 Prescription Details:');
    console.log(`   ID: ${prescription.prescriptionId}`);
    console.log(`   Patient: ${prescription.patientId.name}`);
    console.log(`   Doctor: ${prescription.doctorId.name}`);
    console.log(`   Medicines: ${prescription.medicines.length}`);
    console.log(`   Status: ${prescription.status}`);
    console.log(`   Valid Until: ${prescription.validUntil.toLocaleDateString()}`);
    console.log(`   Diagnosis: ${prescription.diagnosis}`);
    
    console.log('\n💊 Medicines:');
    prescription.medicines.forEach((med, index) => {
      console.log(`   ${index + 1}. ${med.medicineName} (${med.genericName})`);
      console.log(`      - ${med.dosage}, ${med.frequency}, ${med.duration}`);
      console.log(`      - Quantity: ${med.quantity}`);
      console.log(`      - Instructions: ${med.instructions}`);
    });

    console.log('\n✅ Test prescription created successfully!');
    console.log('\n📱 You can now view this prescription in the patient dashboard:');
    console.log(`   1. Login as patient: ${patient.email}`);
    console.log(`   2. Click "💊 My Prescriptions" button`);
    console.log(`   3. View the prescription details`);

  } catch (error) {
    console.error('❌ Error creating prescription:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run script
createTestPrescription();
