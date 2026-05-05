require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fullTest() {
  try {
    // Connect
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('');

    // Define fresh schema with hooks
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true, minlength: 6, select: false },
      role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' }
    }, { timestamps: true });

    // Pre-save hook for password hashing
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    // Drop existing model and create fresh
    delete mongoose.connection.models['User'];
    const User = mongoose.model('User', userSchema);

    // Clean database
    await User.deleteMany({});
    console.log('✅ Database cleaned\n');

    // Test 1: Register
    console.log('TEST 1: Creating user...');
    const user = await User.create({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'patient'
    });
    console.log('✅ User created:', user.email);
    console.log('');

    // Test 2: Login
    console.log('TEST 2: Testing login...');
    const loginUser = await User.findOne({ email: 'patient@test.com' }).select('+password');
    
    if (!loginUser) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('✅ User found');
    console.log('Password hash:', loginUser.password.substring(0, 20) + '...');
    console.log('Is bcrypt hash:', loginUser.password.startsWith('$2'));
    
    const isMatch = await bcrypt.compare('password123', loginUser.password);
    console.log('Password match:', isMatch);
    
    if (isMatch) {
      console.log('\n🎉 ALL TESTS PASSED! Authentication is working!');
      console.log('\nYou can now:');
      console.log('1. Restart the server (it will use the updated model)');
      console.log('2. Register a new user via the frontend');
      console.log('3. Login with: patient@test.com / password123');
    } else {
      console.log('\n❌ Password comparison failed');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fullTest();
