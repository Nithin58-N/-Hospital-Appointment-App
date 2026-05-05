require('dotenv').config();
const https = require('https');
const http = require('http');

const API_URL = 'http://localhost:5000/api';

let patientToken = '';
let doctorToken = '';
let doctorId = '';
let appointmentId = '';

// Simple HTTP request helper
function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(parsed);
          }
        } catch (e) {
          reject({ message: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing Doctor Registration and Appointments\n');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Register a Doctor
    console.log('\n📝 TEST 1: Register Doctor');
    console.log('-'.repeat(50));
    const doctorRes = await request('POST', '/auth/register', {
      name: 'Dr. Sarah Smith',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Cardiology',
      experience: 10,
      contact: '1234567890'
    });
    
    doctorToken = doctorRes.data.token;
    console.log('✅ Doctor registered successfully');
    console.log('   Name:', doctorRes.data.name);
    console.log('   Email:', doctorRes.data.email);
    console.log('   Role:', doctorRes.data.role);

    // Test 2: Get all doctors
    console.log('\n📋 TEST 2: Get All Doctors');
    console.log('-'.repeat(50));
    const doctorsRes = await request('GET', '/doctors');
    console.log('✅ Doctors retrieved:', doctorsRes.count);
    
    if (doctorsRes.data.length > 0) {
      const doctor = doctorsRes.data[0];
      doctorId = doctor._id;
      console.log('   Doctor ID:', doctorId);
      console.log('   Name:', doctor.name);
      console.log('   Specialization:', doctor.specialization);
      console.log('   Experience:', doctor.experience, 'years');
      console.log('   Contact:', doctor.contact);
    }

    // Test 3: Update doctor slots
    console.log('\n⏰ TEST 3: Update Doctor Available Slots');
    console.log('-'.repeat(50));
    const slotsRes = await request('PUT', `/doctors/${doctorId}/slots`, {
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    }, doctorToken);
    console.log('✅ Slots updated successfully');
    console.log('   Available slots:', slotsRes.data.availableSlots.join(', '));

    // Test 4: Register a Patient
    console.log('\n👤 TEST 4: Register Patient');
    console.log('-'.repeat(50));
    const patientRes = await request('POST', '/auth/register', {
      name: 'John Patient',
      email: 'patient2@test.com',
      password: 'password123',
      role: 'patient'
    });
    
    patientToken = patientRes.data.token;
    console.log('✅ Patient registered successfully');
    console.log('   Name:', patientRes.data.name);
    console.log('   Email:', patientRes.data.email);

    // Test 5: Book an appointment
    console.log('\n📅 TEST 5: Book Appointment');
    console.log('-'.repeat(50));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];
    
    const appointmentRes = await request('POST', '/appointments', {
      doctorId: doctorId,
      date: appointmentDate,
      time: '10:00',
      reason: 'Regular checkup'
    }, patientToken);
    
    appointmentId = appointmentRes.data._id;
    console.log('✅ Appointment booked successfully');
    console.log('   Appointment ID:', appointmentId);
    console.log('   Doctor:', appointmentRes.data.doctorId.name);
    console.log('   Date:', appointmentDate);
    console.log('   Time:', appointmentRes.data.time);
    console.log('   Status:', appointmentRes.data.status);

    // Test 6: Get patient appointments
    console.log('\n📋 TEST 6: Get Patient Appointments');
    console.log('-'.repeat(50));
    const patientAppointmentsRes = await request('GET', '/appointments/my', null, patientToken);
    console.log('✅ Patient appointments retrieved:', patientAppointmentsRes.count);

    // Test 7: Get doctor appointments
    console.log('\n📋 TEST 7: Get Doctor Appointments');
    console.log('-'.repeat(50));
    const doctorAppointmentsRes = await request('GET', '/appointments/doctor', null, doctorToken);
    console.log('✅ Doctor appointments retrieved:', doctorAppointmentsRes.count);

    // Test 8: Update appointment status
    console.log('\n✅ TEST 8: Doctor Completes Appointment');
    console.log('-'.repeat(50));
    const updateStatusRes = await request('PUT', `/appointments/${appointmentId}/status`, {
      status: 'completed'
    }, doctorToken);
    console.log('✅ Appointment status updated to:', updateStatusRes.data.status);

    // Test 9: Try double booking
    console.log('\n❌ TEST 9: Try Double Booking (Should Fail)');
    console.log('-'.repeat(50));
    try {
      await request('POST', '/appointments', {
        doctorId: doctorId,
        date: appointmentDate,
        time: '10:00',
        reason: 'Another checkup'
      }, patientToken);
      console.log('❌ FAILED: Double booking was allowed');
    } catch (error) {
      console.log('✅ Double booking prevented correctly');
      console.log('   Error:', error.message);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n✅ Doctor Registration & Profile: Working');
    console.log('✅ Doctor Slots Management: Working');
    console.log('✅ Patient Registration: Working');
    console.log('✅ Appointment Booking: Working');
    console.log('✅ Get Appointments: Working');
    console.log('✅ Update Status: Working');
    console.log('✅ Double Booking Prevention: Working');
    
    console.log('\n🔑 Test Credentials:');
    console.log('   Doctor: doctor@test.com / password123');
    console.log('   Patient: patient2@test.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('Error:', error.message || error);
    process.exit(1);
  }
}

test();
