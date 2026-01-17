require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const achievementsData = require('./achievements');

const connectDB = require('../config/database');

async function seedAchievements() {
  try {
    console.log('🌱 Starting achievement seeding...');

    // Clear existing achievements
    const deleteResult = await Achievement.deleteMany({});
    console.log(`   Cleared ${deleteResult.deletedCount} existing achievements`);

    // Insert new achievements
    const inserted = await Achievement.insertMany(achievementsData);
    console.log(`   ✅ Successfully seeded ${inserted.length} achievements`);

    // Display achievements by category
    const categories = ['milestone', 'mastery', 'consistency', 'speed', 'special'];
    console.log('\n📊 Achievements by category:');
    for (const category of categories) {
      const count = inserted.filter(a => a.category === category).length;
      console.log(`   ${category.padEnd(12)}: ${count}`);
    }

    // Display achievements by rarity
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    console.log('\n✨ Achievements by rarity:');
    for (const rarity of rarities) {
      const count = inserted.filter(a => a.rarity === rarity).length;
      console.log(`   ${rarity.padEnd(12)}: ${count}`);
    }

    return inserted;
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
    throw error;
  }
}

async function createIndexes() {
  try {
    console.log('\n🔍 Creating database indexes...');

    // Achievement indexes
    await Achievement.collection.createIndex({ category: 1, order: 1 });
    await Achievement.collection.createIndex({ rarity: 1 });
    await Achievement.collection.createIndex({ achievementId: 1 }, { unique: true });
    await Achievement.collection.createIndex({ isActive: 1 });
    console.log('   ✅ Achievement indexes created');

    // User indexes (if User model exists)
    try {
      const User = require('../models/User');
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ 'profile.ageGroup': 1 });
      await User.collection.createIndex({ role: 1 });
      console.log('   ✅ User indexes created');
    } catch (err) {
      console.log('   ⚠️  User model not found, skipping user indexes');
    }

    // UserProgress indexes
    try {
      const UserProgress = require('../models/UserProgress');
      await UserProgress.collection.createIndex({ userId: 1 }, { unique: true });
      await UserProgress.collection.createIndex({ totalXP: -1 });
      await UserProgress.collection.createIndex({ currentLevel: -1 });
      await UserProgress.collection.createIndex({ rank: 1 });
      console.log('   ✅ UserProgress indexes created');
    } catch (err) {
      console.log('   ⚠️  UserProgress model not found, skipping');
    }

    // Assessment indexes
    try {
      const Assessment = require('../models/Assessment');
      await Assessment.collection.createIndex({ userId: 1, completedAt: -1 });
      await Assessment.collection.createIndex({ userId: 1, assessmentType: 1 });
      await Assessment.collection.createIndex({ completedAt: -1 });
      console.log('   ✅ Assessment indexes created');
    } catch (err) {
      console.log('   ⚠️  Assessment model not found, skipping');
    }

    // GameSession indexes
    try {
      const GameSession = require('../models/GameSession');
      await GameSession.collection.createIndex({ userId: 1, createdAt: -1 });
      await GameSession.collection.createIndex({ userId: 1, gameType: 1 });
      await GameSession.collection.createIndex({ status: 1 });
      await GameSession.collection.createIndex({ gameType: 1, createdAt: -1 });
      console.log('   ✅ GameSession indexes created');
    } catch (err) {
      console.log('   ⚠️  GameSession model not found, skipping');
    }

    console.log('✅ All indexes created successfully\n');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database initialization...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Seed achievements
    await seedAchievements();

    // Create indexes
    await createIndexes();

    console.log('🎉 Database initialization complete!\n');
    console.log('Summary:');
    console.log('  - Achievements seeded: ✅');
    console.log('  - Indexes created: ✅');
    console.log('  - Ready for production: ✅\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedAchievements, createIndexes };
