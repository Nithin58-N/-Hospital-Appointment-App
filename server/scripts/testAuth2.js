require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function testAuth() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB\n');

    // Define schema inline to ensure hooks are registered
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' }
    }, { timestamps: true });

    // Add pre-save hook
    userSchema.pre('save', async function(next) {
      console.log('✅ Pre-save hook triggered!');
      if (!this.isModified('password')) {
        return next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('✅ Password hashed!');
      next();
    });

    // Create or get model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Clean up
    await User.deleteOne({ email: 'test2@test.com' });

    // Create user
    console.log('Creating user...');
    const user = await User.create({
      name: 'Test User 2',
      email: 'test2@test.com',
      password: 'password123',
      role: 'patient'
    });
    console.log('User created\n');

    // Fetch and test
    const fetchedUser = await User.findOne({ email: 'test2@test.com' }).select('+password');
    console.log('Password in DB:', fetchedUser.password);
    console.log('Is bcrypt hash:', fetchedUser.password.startsWith('$2'));
    
    const isMatch = await bcrypt.compare('password123', fetchedUser.password);
    console.log('Password match:', isMatch);
    
    if (isMatch) {
      console.log('\n🎉 SUCCESS!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAuth();
