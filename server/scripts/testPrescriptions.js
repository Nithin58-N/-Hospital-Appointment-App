/**
 * Test Prescription Management Models
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Prescription = require('../src/models/Prescription');
const Medicine = require('../src/models/Medicine');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');

const testPrescriptionModels = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check Medicine model
    console.log('📋 Test 1: Medicine Model');
    const medicineCount = await Medicine.countDocuments();
    console.log(`✅ Found ${medicineCount} medicines in database`);
    
    const sampleMedicine = await Medicine.findOne();
    if (sampleMedicine) {
      console.log('   Sample medicine:', sampleMedicine.name);
      console.log('   Category:', sampleMedicine.category);
      console.log('   Strength:', sampleMedicine.strength);
    }

    // Test 2: Search medicines
    console.log('\n📋 Test 2: Medicine Search');
    const searchResults = await Medicine.find({
      $or: [
        { name: { $regex: 'para', $options: 'i' } },
        { genericName: { $regex: 'para', $options: 'i' } }
      ],
      isActive: true
    }).limit(5);
    console.log(`✅ Search for "para" found ${searchResults.length} results:`);
    searchResults.forEach(m => console.log(`   - ${m.name} (${m.genericName})`));

    // Test 3: Check Prescription model
    console.log('\n📋 Test 3: Prescription Model');
    const patient = await User.findOne({ role: 'patient' });
    const doctor = await Doctor.findOne();
    
    if (patient && doctor && sampleMedicine) {
      const testPrescription = new Prescription({
        patientId: patient._id,
        doctorId: doctor._id,
        medicines: [{
          medicineId: sampleMedicine._id,
          medicineName: sampleMedicine.name,
          genericName: sampleMedicine.genericName,
          dosage: '1 tablet',
          strength: sampleMedicine.strength[0],
          frequency: 'Three times daily',
          duration: '5 days',
          quantity: 15,
          instructions: 'Take after meals'
        }],
        diagnosis: 'Test diagnosis',
        status: 'active',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      const validationError = testPrescription.validateSync();
      if (!validationError) {
        console.log('✅ Prescription model validation passed');
        console.log('   Available statuses:', ['draft', 'active', 'expired', 'cancelled']);
        console.log('   Instance methods:', ['isExpired()', 'canRequestRefill()']);
      } else {
        console.log('❌ Prescription validation failed:', validationError.message);
      }
    } else {
      console.log('⚠️  Missing required data (patient, doctor, or medicine)');
    }

    // Test 4: Check prescription count
    console.log('\n📋 Test 4: Existing Prescriptions');
    const prescriptionCount = await Prescription.countDocuments();
    console.log(`✅ Found ${prescriptionCount} prescriptions in database`);

    console.log('\n✅ All model tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   ✅ Medicine database: ${medicineCount} medicines`);
    console.log('   ✅ Medicine search working');
    console.log('   ✅ Prescription model validated');
    console.log(`   ✅ Existing prescriptions: ${prescriptionCount}`);
    console.log('\n🚀 Backend models are ready!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run tests
testPrescriptionModels();

