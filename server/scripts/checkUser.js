require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB\n');

    const user = await User.findOne({ email: 'patient@test.com' }).select('+password');
    
    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Password (hashed):', user.password);
      console.log('Password starts with $2:', user.password.startsWith('$2'));
      console.log('Password length:', user.password.length);
      
      // Test bcrypt compare
      const bcrypt = require('bcryptjs');
      const match = await bcrypt.compare('password123', user.password);
      console.log('\nBcrypt compare result:', match);
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
