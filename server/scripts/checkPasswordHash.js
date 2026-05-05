require('dotenv').config();
const mongoose = require('mongoose');

async function checkPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB\n');

    // Get all users with passwords
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log(`Found ${users.length} users\n`);
    
    users.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Is Hashed (starts with $2): ${user.password.startsWith('$2')}`);
      console.log(`   Length: ${user.password.length}`);
      console.log('');
    });
    
    const hashedCount = users.filter(u => u.password.startsWith('$2')).length;
    const plainCount = users.length - hashedCount;
    
    console.log('Summary:');
    console.log(`✅ Hashed passwords: ${hashedCount}`);
    console.log(`❌ Plain text passwords: ${plainCount}`);
    
    if (plainCount > 0) {
      console.log('\n⚠️  WARNING: Some passwords are NOT hashed!');
      console.log('The pre-save hook is not working.');
    } else {
      console.log('\n✅ All passwords are properly hashed!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPasswords();
