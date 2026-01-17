# ⚡ CogniQuest Quick Start

## 5-Minute Setup

### Prerequisites
```bash
# Verify you have these installed:
node --version    # Need v16+
npm --version     # Need v8+
mongod --version  # Need MongoDB
```

### Setup Commands
```bash
# 1. Install dependencies (2 min)
cd backend && npm install
cd ../frontend && npm install

# 2. Initialize database (30 sec)
cd backend && npm run seed

# 3. Start servers (in 2 separate terminals)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm start
```

### Test It
```bash
# Open browser → http://localhost:3000
# Register account → test@cogniquest.com / Test123!
# Take assessment → Play games → Check dashboard
```

---

## Environment Files Created ✅

**Backend (.env):**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cogniquest
JWT_SECRET=cogniquest-super-secret-jwt-key-for-development-2026
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## MongoDB Setup

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Windows:** Download from https://www.mongodb.com/try/download/community

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Cloud (MongoDB Atlas):** https://www.mongodb.com/cloud/atlas/register

---

## What You Get

✅ **Backend API** (http://localhost:5000)
- 50 seeded achievements
- All database indexes
- Authentication ready
- 7 game types

✅ **Frontend App** (http://localhost:3000)
- 7 complete pages
- Responsive design
- Real-time updates
- Progress tracking

---

## Test Routes

After starting servers:

| Page | URL | What to Test |
|------|-----|--------------|
| Registration | `/vendor/register` | Create account |
| Login | `/vendor/login` | Sign in |
| Dashboard | `/dashboard` | Main hub |
| Assessment | `/assessment` | Take baseline test |
| Games | `/games` | Browse game types |
| Play | `/play/visual-pattern` | Play a game |
| Progress | `/progress` | View analytics |
| Achievements | `/achievements` | Check unlocks |
| Leaderboard | `/leaderboard` | See rankings |

---

## Common Issues

**MongoDB won't connect:**
```bash
# Check if running
brew services list | grep mongodb  # macOS
sudo systemctl status mongodb      # Linux

# Start it
brew services start mongodb-community  # macOS
sudo systemctl start mongodb           # Linux
```

**Port already in use:**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**"Module not found":**
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

---

## Full Documentation

- 📘 **BETA_LAUNCH.md** - Complete testing guide
- 📘 **DATABASE_SETUP.md** - MongoDB setup details
- 📘 **PATTERN_RECOGNITION_SPEC.md** - Full specification
- 📘 **FRONTEND_COMPLETE.md** - Frontend build details

---

## Beta Testing Checklist

- [ ] Register user account
- [ ] Complete assessment (15 min)
- [ ] Play all 7 game types
- [ ] Check progress dashboard
- [ ] View achievements
- [ ] Test leaderboard
- [ ] Check mobile responsive design
- [ ] Report bugs/feedback

---

## Quick Commands Reference

```bash
# Database
npm run seed              # Initialize database with achievements

# Backend
npm start                 # Production mode
npm run dev              # Development mode (auto-reload)
npm test                 # Run tests

# Frontend
npm start                # Start dev server
npm build                # Create production build
npm test                 # Run tests
```

---

## Success Indicators

✅ Backend console shows:
```
Server running on port 5000
MongoDB connected successfully
```

✅ Database seeding shows:
```
🎉 Database initialization complete!
```

✅ Frontend opens automatically at:
```
http://localhost:3000
```

✅ You can:
- Register and login
- Complete assessment
- Play games
- See progress update
- Unlock achievements

---

## 🎯 You're Ready!

Open http://localhost:3000 and start testing!

For detailed instructions, see **BETA_LAUNCH.md**
