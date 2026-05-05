require('dotenv').config();
const mongoose = require('mongoose');

// Clear require cache to ensure fresh model load
delete require.cache[require.resolve('../src/models/User')];

const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function testAuth() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB:', process.env.MONGO_URI);
    console.log('Database:', mongoose.connection.name);
    console.log('');

    // Clean up existing test user
    await User.deleteOne({ email: 'test@test.com' });
    console.log('Cleaned up old test user\n');

    // Create a new user
    console.log('Creating new user...');
    const user = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'patient'
    });
    console.log('✅ User created:', user.email);
    console.log('');

    // Fetch user with password
    const fetchedUser = await User.findOne({ email: 'test@test.com' }).select('+password');
    console.log('Fetched user password (hashed):', fetchedUser.password);
    console.log('Is bcrypt hash:', fetchedUser.password.startsWith('$2'));
    console.log('');

    // Test password comparison
    console.log('Testing password comparison...');
    const isMatch = await bcrypt.compare('password123', fetchedUser.password);
    console.log('✅ Password match:', isMatch);
    console.log('');

    if (isMatch) {
      console.log('🎉 SUCCESS! Authentication is working correctly!');
    } else {
      console.log('❌ FAILED! Password comparison failed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAuth();
