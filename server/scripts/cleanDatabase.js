require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Database Cleanup Script
 * Deletes all users, doctors, and appointments
 * Use this to start fresh with the new backend
 */

async function cleanDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Delete all collections
    const collections = ['users', 'doctors', 'appointments'];
    
    for (const collection of collections) {
      const result = await mongoose.connection.db.collection(collection).deleteMany({});
      console.log(`Deleted ${result.deletedCount} documents from ${collection}`);
    }

    console.log('\n✅ Database cleaned successfully!');
    console.log('You can now register new users with the updated backend.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();
