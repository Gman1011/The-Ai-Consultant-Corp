# Database Setup Guide

## Quick Start

Initialize the MongoDB database with achievements and indexes:

```bash
cd backend
npm run seed
```

This will:
- ✅ Connect to MongoDB
- ✅ Clear existing achievements
- ✅ Seed 50+ achievements
- ✅ Create all database indexes
- ✅ Display summary statistics

---

## Prerequisites

### 1. MongoDB Installation

**Option A: Local MongoDB**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Verify installation
mongo --version
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

### 2. Environment Configuration

Create `/backend/.env` file:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/cogniquest
# or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cogniquest

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Google Maps (for food truck features)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## Database Initialization

### Full Initialization
```bash
cd backend
npm run seed
```

**Expected Output:**
```
🚀 Starting database initialization...

✅ Connected to MongoDB

🌱 Starting achievement seeding...
   Cleared 0 existing achievements
   ✅ Successfully seeded 50 achievements

📊 Achievements by category:
   milestone   : 15
   mastery     : 18
   consistency : 7
   speed       : 5
   special     : 5

✨ Achievements by rarity:
   common      : 12
   rare        : 18
   epic        : 13
   legendary   : 7

🔍 Creating database indexes...
   ✅ Achievement indexes created
   ✅ User indexes created
   ✅ UserProgress indexes created
   ✅ Assessment indexes created
   ✅ GameSession indexes created
✅ All indexes created successfully

🎉 Database initialization complete!

Summary:
  - Achievements seeded: ✅
  - Indexes created: ✅
  - Ready for production: ✅
```

---

## Database Collections

After seeding, your database will have:

### 1. `achievements` (50 documents)
Predefined achievement definitions by category:

**Milestones** (15 achievements)
- First session completion
- Level milestones (5, 10, 25, 50, 100)
- Session count milestones (10, 50, 100, 500)

**Mastery** (18 achievements)
- Perfect scores
- High accuracy maintenance
- Game-specific mastery (25+ games per type)
- Skill tree mastery

**Consistency** (7 achievements)
- Login streaks (7, 30, 365 days)
- Answer streaks (10, 20 correct)

**Speed** (5 achievements)
- Fast response times (< 2s, < 500ms)
- Speed + accuracy combos

**Special** (5 achievements)
- Time-based (early bird, night owl)
- Cognitive improvement
- AI readiness milestones
- Exploration achievements

### 2. Database Indexes

**Performance Indexes Created:**
```javascript
// Achievements
achievements.achievementId (unique)
achievements.category
achievements.rarity
achievements.isActive
achievements.order

// Users
users.email (unique)
users.profile.ageGroup
users.role

// UserProgress
userprogress.userId (unique)
userprogress.totalXP (descending)
userprogress.currentLevel (descending)
userprogress.rank

// Assessments
assessments.userId + completedAt
assessments.userId + assessmentType

// GameSessions
gamesessions.userId + createdAt
gamesessions.userId + gameType
gamesessions.status
gamesessions.gameType + createdAt
```

---

## Verification

### Check Database Connection
```bash
# Connect to MongoDB shell
mongo cogniquest

# Or with mongosh (newer versions)
mongosh cogniquest

# List collections
show collections

# Count achievements
db.achievements.count()
# Should return: 50

# View first achievement
db.achievements.findOne()

# List indexes
db.achievements.getIndexes()
```

### Test API Endpoints
```bash
# Start backend server
npm run dev

# Test achievement endpoint (requires authentication)
curl http://localhost:5000/api/progress/achievements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list              # macOS

# Start MongoDB
sudo systemctl start mongodb    # Linux
brew services start mongodb-community  # macOS
```

### Issue: Database Already Seeded
The seed script will automatically clear existing achievements before seeding. This is safe and expected behavior.

### Issue: Index Creation Failed
```
MongoServerError: Index already exists with different options
```

**Solution:**
```bash
# Drop existing indexes and re-run
mongo cogniquest --eval "db.achievements.dropIndexes()"
npm run seed
```

---

## Manual Database Operations

### Clear All Achievements
```javascript
// In MongoDB shell
use cogniquest
db.achievements.deleteMany({})
```

### Add Custom Achievement
```javascript
db.achievements.insertOne({
  achievementId: 'custom-achievement',
  name: 'Custom Achievement',
  description: 'Your custom description',
  category: 'special',
  criteria: {
    type: 'sessions_completed',
    value: 5,
    comparison: 'greater_or_equal'
  },
  reward: {
    xp: 100,
    badge: 'custom-badge',
    unlocks: []
  },
  rarity: 'common',
  order: 100,
  isActive: true
})
```

### Query Achievements by Rarity
```javascript
// Find all legendary achievements
db.achievements.find({ rarity: 'legendary' }).pretty()

// Count by category
db.achievements.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } }
])
```

---

## Achievement System Details

### Achievement Structure
```javascript
{
  achievementId: 'unique-id',        // Unique identifier
  name: 'Achievement Name',          // Display name
  description: 'Description',        // What it takes to unlock
  category: 'milestone',             // milestone|mastery|consistency|speed|special
  criteria: {
    type: 'sessions_completed',      // Type of criterion
    value: 10,                       // Target value
    gameType: 'visual-pattern',      // Optional: specific game
    comparison: 'greater_or_equal'   // How to compare
  },
  reward: {
    xp: 100,                         // XP awarded
    badge: 'badge-name',             // Badge icon/name
    unlocks: ['feature1'],           // Unlocked features
    title: 'Title'                   // Optional profile title
  },
  rarity: 'rare',                    // common|rare|epic|legendary
  order: 1,                          // Display order
  isActive: true                     // Active status
}
```

### Criteria Types
- `sessions_completed` - Total or game-specific session count
- `level_reached` - User level milestone
- `accuracy_threshold` - Average accuracy percentage
- `streak_achieved` - Consecutive correct answers
- `consecutive_days` - Daily login streak
- `fast_completion` - Response time under threshold
- `perfect_game` - 100% accuracy session
- `skill_tree_mastery` - Skill tree level reached
- `cognitive_improvement` - Cognitive score increase
- `ai_readiness` - AI readiness score threshold
- And 15+ more types...

### Rarity Levels
- **Common** (⚪): Easy to unlock, frequent rewards
- **Rare** (🔵): Moderate difficulty, good rewards
- **Epic** (🟣): Challenging, great rewards
- **Legendary** (🟡): Very difficult, exceptional rewards

---

## Production Deployment

### Before Deploying

1. **Backup Production Database**
```bash
mongodump --uri="mongodb://production-uri" --out=backup-$(date +%Y%m%d)
```

2. **Run Seed on Staging First**
```bash
MONGODB_URI=mongodb://staging-uri npm run seed
```

3. **Verify Staging**
- Test achievement unlocking
- Verify indexes exist
- Check performance

4. **Deploy to Production**
```bash
MONGODB_URI=mongodb://production-uri npm run seed
```

### Monitoring

```javascript
// Check database size
db.stats()

// Monitor slow queries
db.setProfilingLevel(1, 100)  // Log queries > 100ms
db.system.profile.find().limit(5).sort({ts: -1}).pretty()

// Check index usage
db.achievements.aggregate([{$indexStats: {}}])
```

---

## Summary

✅ **50 Achievements** across 5 categories and 4 rarity levels
✅ **Optimized Indexes** for fast queries on all collections
✅ **One Command Setup** - `npm run seed`
✅ **Idempotent** - Safe to run multiple times
✅ **Verified** - Includes testing and verification steps

Your CogniQuest database is now ready for production! 🚀
