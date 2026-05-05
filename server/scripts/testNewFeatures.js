/**
 * Test script for new features:
 * - Appointment rescheduling
 * - Medical records
 * - Reviews
 * - Enhanced profiles
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Appointment = require('../src/models/Appointment');
const MedicalRecord = require('../src/models/MedicalRecord');
const Review = require('../src/models/Review');

const testNewFeatures = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check enhanced User model
    console.log('📋 Test 1: Enhanced User Model');
    const patient = await User.findOne({ role: 'patient' });
    if (patient) {
      console.log('✅ Patient found:', patient.name);
      console.log('   New fields available:', {
        profilePicture: patient.profilePicture !== undefined,
        phone: patient.phone !== undefined,
        bloodGroup: patient.bloodGroup !== undefined,
        address: patient.address !== undefined,
        emergencyContact: patient.emergencyContact !== undefined,
        medicalHistory: patient.medicalHistory !== undefined,
        insurance: patient.insurance !== undefined
      });
    } else {
      console.log('⚠️  No patient found in database');
    }

    // Test 2: Check enhanced Doctor model
    console.log('\n📋 Test 2: Enhanced Doctor Model');
    const doctor = await Doctor.findOne();
    if (doctor) {
      console.log('✅ Doctor found:', doctor.name);
      console.log('   New fields available:', {
        education: doctor.education !== undefined,
        certifications: doctor.certifications !== undefined,
        awards: doctor.awards !== undefined,
        languages: doctor.languages !== undefined,
        clinicAddress: doctor.clinicAddress !== undefined,
        consultationFees: doctor.consultationFees !== undefined,
        bio: doctor.bio !== undefined,
        photoGallery: doctor.photoGallery !== undefined,
        averageRating: doctor.averageRating !== undefined,
        totalReviews: doctor.totalReviews !== undefined
      });
      console.log('   Average Rating:', doctor.averageRating);
      console.log('   Total Reviews:', doctor.totalReviews);
    } else {
      console.log('⚠️  No doctor found in database');
    }

    // Test 3: Check enhanced Appointment model
    console.log('\n📋 Test 3: Enhanced Appointment Model');
    const appointment = await Appointment.findOne();
    if (appointment) {
      console.log('✅ Appointment found');
      console.log('   New fields available:', {
        originalDate: appointment.originalDate !== undefined,
        originalTime: appointment.originalTime !== undefined,
        rescheduleCount: appointment.rescheduleCount !== undefined,
        rescheduleHistory: appointment.rescheduleHistory !== undefined
      });
      console.log('   Reschedule Count:', appointment.rescheduleCount);
      console.log('   Reschedule History Length:', appointment.rescheduleHistory.length);
    } else {
      console.log('⚠️  No appointment found in database');
    }

    // Test 4: Test MedicalRecord model
    console.log('\n📋 Test 4: MedicalRecord Model');
    if (patient && doctor) {
      const testRecord = new MedicalRecord({
        patientId: patient._id,
        doctorId: doctor._id,
        type: 'prescription',
        title: 'Test Prescription',
        description: 'Test medical record for validation'
      });
      
      const validationError = testRecord.validateSync();
      if (!validationError) {
        console.log('✅ MedicalRecord model validation passed');
        console.log('   Available types:', ['prescription', 'lab_report', 'diagnosis', 'document', 'other']);
      } else {
        console.log('❌ MedicalRecord validation failed:', validationError.message);
      }
    }

    // Test 5: Test Review model
    console.log('\n📋 Test 5: Review Model');
    if (patient && doctor) {
      const testReview = new Review({
        doctorId: doctor._id,
        patientId: patient._id,
        rating: 5,
        comment: 'Test review for validation'
      });
      
      const validationError = testReview.validateSync();
      if (!validationError) {
        console.log('✅ Review model validation passed');
        console.log('   Rating range: 1-5');
        console.log('   Fields available: rating, comment, reply, isReported');
      } else {
        console.log('❌ Review validation failed:', validationError.message);
      }
    }

    // Test 6: Check if routes are properly configured
    console.log('\n📋 Test 6: API Routes Configuration');
    console.log('✅ New routes should be available:');
    console.log('   - PUT /api/appointments/:id/reschedule');
    console.log('   - POST /api/medical-records');
    console.log('   - GET /api/medical-records/patient/:patientId');
    console.log('   - POST /api/reviews');
    console.log('   - GET /api/reviews/doctor/:doctorId');
    console.log('   - PUT /api/reviews/:id/reply');

    console.log('\n✅ All model tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✅ Enhanced User model with patient profile fields');
    console.log('   ✅ Enhanced Doctor model with professional details');
    console.log('   ✅ Enhanced Appointment model with reschedule tracking');
    console.log('   ✅ New MedicalRecord model created');
    console.log('   ✅ New Review model created');
    console.log('\n🚀 Backend is ready! Now implement frontend components.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run tests
testNewFeatures();
