require('dotenv').config();
const http = require('http');

const API_URL = 'http://localhost:5000/api';

// Sample doctors data
const doctors = [
  {
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Cardiology',
    experience: 15,
    contact: '1234567890'
  },
  {
    name: 'Dr. Michael Johnson',
    email: 'michael.johnson@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Neurology',
    experience: 12,
    contact: '2345678901'
  },
  {
    name: 'Dr. Emily Davis',
    email: 'emily.davis@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Pediatrics',
    experience: 8,
    contact: '3456789012'
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Orthopedics',
    experience: 20,
    contact: '4567890123'
  },
  {
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Dermatology',
    experience: 10,
    contact: '5678901234'
  },
  {
    name: 'Dr. Robert Brown',
    email: 'robert.brown@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'General Medicine',
    experience: 18,
    contact: '6789012345'
  },
  {
    name: 'Dr. Jennifer Martinez',
    email: 'jennifer.martinez@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Gynecology',
    experience: 14,
    contact: '7890123456'
  },
  {
    name: 'Dr. David Lee',
    email: 'david.lee@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Psychiatry',
    experience: 11,
    contact: '8901234567'
  },
  {
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Ophthalmology',
    experience: 9,
    contact: '9012345678'
  },
  {
    name: 'Dr. Thomas White',
    email: 'thomas.white@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'ENT',
    experience: 16,
    contact: '0123456789'
  }
];

// Common available slots for all doctors
const commonSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

// HTTP request helper
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

async function addDoctors() {
  console.log('👨‍⚕️ Adding Doctors to Hospital System\n');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const addedDoctors = [];

  for (let i = 0; i < doctors.length; i++) {
    const doctor = doctors[i];
    console.log(`\n[${i + 1}/${doctors.length}] Adding ${doctor.name}...`);
    console.log('   Specialization:', doctor.specialization);
    console.log('   Experience:', doctor.experience, 'years');
    
    try {
      // Register doctor (password will be hashed in controller)
      const registerRes = await request('POST', '/auth/register', doctor);
      const doctorToken = registerRes.data.token;
      
      console.log('   ✅ Registered successfully');
      
      // Get doctor profile ID
      const doctorsRes = await request('GET', '/doctors');
      const doctorProfile = doctorsRes.data.find(d => d.name === doctor.name);
      
      if (doctorProfile) {
        // Update available slots
        await request('PUT', `/doctors/${doctorProfile._id}/slots`, {
          availableSlots: commonSlots
        }, doctorToken);
        
        console.log('   ✅ Available slots updated');
        console.log('   📅 Slots:', commonSlots.join(', '));
        
        addedDoctors.push({
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          id: doctorProfile._id
        });
        
        successCount++;
      }
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log('   ⚠️  Already exists, skipping...');
        skipCount++;
      } else {
        console.log('   ❌ Error:', error.message || 'Unknown error');
        errorCount++;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully added: ${successCount}`);
  console.log(`⚠️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📋 Total doctors: ${successCount + skipCount}`);

  if (addedDoctors.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('👨‍⚕️ Added Doctors');
    console.log('='.repeat(60));
    addedDoctors.forEach((doc, idx) => {
      console.log(`${idx + 1}. ${doc.name}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Specialization: ${doc.specialization}`);
      console.log(`   ID: ${doc.id}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('🔑 Login Credentials');
  console.log('='.repeat(60));
  console.log('All doctors can login with:');
  console.log('Password: doctor123');
  console.log('\nExample:');
  console.log('Email: sarah.smith@hospital.com');
  console.log('Password: doctor123');

  console.log('\n✅ Done! Doctors are ready to accept appointments.\n');
  process.exit(0);
}

addDoctors().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
