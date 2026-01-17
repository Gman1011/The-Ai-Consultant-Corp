# 🚀 CogniQuest Beta Launch Guide

## Complete Setup & Testing Instructions

This guide will walk you through launching the CogniQuest Pattern Recognition Platform beta on your local machine.

---

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed (`node --version`)
- ✅ npm v8+ installed (`npm --version`)
- ✅ Git installed (`git --version`)
- ✅ MongoDB installed (we'll set this up below)

---

## Part 1: MongoDB Setup (5 minutes)

### Option A: Local MongoDB (Recommended for Beta)

**macOS:**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
brew services list | grep mongodb
```

**Windows:**
```bash
# Download installer from: https://www.mongodb.com/try/download/community
# Run the installer
# MongoDB will start automatically as a service

# Verify in PowerShell:
Get-Service MongoDB
```

**Linux (Ubuntu/Debian):**
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify
sudo systemctl status mongodb
```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free M0 cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `/backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cogniquest?retryWrites=true&w=majority
   ```

---

## Part 2: Install Dependencies (3 minutes)

```bash
# Navigate to project root
cd The-Ai-Consultant-Corp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

**Expected output:** Both should complete without errors.

---

## Part 3: Initialize Database (1 minute)

```bash
# From backend directory
cd backend
npm run seed
```

**Expected output:**
```
🚀 Starting database initialization...
✅ Connected to MongoDB
🌱 Seeded 50 achievements
📊 Achievements by category: milestone(15), mastery(18), consistency(7), speed(5), special(5)
✨ Achievements by rarity: common(12), rare(18), epic(13), legendary(7)
🔍 Created all indexes
🎉 Database initialization complete!
```

**If you see this, you're ready to launch! 🎉**

---

## Part 4: Launch Servers (1 minute)

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 5000
MongoDB connected successfully
```

**✅ Backend is live at:** http://localhost:5000

### Terminal 2: Frontend Server
```bash
# Open a NEW terminal window
cd frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**✅ Frontend should automatically open at:** http://localhost:3000

---

## Part 5: Beta Testing Checklist

### 🧪 Test 1: User Registration (2 minutes)

1. Navigate to http://localhost:3000
2. Click "Register" or go to `/vendor/register` (temp route)
3. Create test account:
   - Email: `test@cogniquest.com`
   - Password: `Test123!`
   - Name: `Beta Tester`
4. Submit form

**✅ Success:** You're logged in and see dashboard

**❌ If error:** Check backend console for error messages

---

### 🧪 Test 2: Initial Assessment (15 minutes)

1. Navigate to `/assessment`
2. Complete the baseline assessment:
   - 5 cognitive questions (working memory, processing speed, etc.)
   - 3 personality questions (Likert scale)
   - 3 AI readiness questions
3. Review your results page

**✅ Success:** You see:
- Cognitive scores (5 dimensions)
- AI readiness score
- Personalized insights
- Recommendations

**❌ If error:** Check browser console (F12) and backend logs

---

### 🧪 Test 3: Play Games (10 minutes)

1. Navigate to `/games`
2. Try each game type:

**Visual Patterns:**
- Click "Visual Patterns" game
- Complete 5-10 pattern problems
- Check if difficulty adapts

**Sequence Recognition:**
- Play a sequence game
- Test number/letter patterns

**Speed Challenge:**
- Quick pattern matching
- Test timer functionality

**✅ Success:** Games work smoothly, you get instant feedback, XP is awarded

---

### 🧪 Test 4: Progress & Analytics (5 minutes)

1. Navigate to `/progress`
2. Check all 4 tabs:
   - **Overview**: Recent activity, trends
   - **Cognitive Growth**: Radar chart (if you took assessment)
   - **Game Stats**: Per-game breakdown
   - **Time & AI**: Performance by time of day

**✅ Success:** All data displays correctly

---

### 🧪 Test 5: Achievements (3 minutes)

1. Navigate to `/achievements`
2. Check unlocked achievements
3. Filter by:
   - All, Unlocked, Locked
   - Categories: Milestone, Mastery, etc.

**Expected achievements unlocked:**
- "First Steps" (complete 1 session)
- "Getting Started" (complete 10 sessions) - may need more games
- Check progress bars on locked achievements

**✅ Success:** Achievements display with correct status

---

### 🧪 Test 6: Leaderboard (2 minutes)

1. Navigate to `/leaderboard`
2. Toggle between:
   - Global rankings
   - Age group rankings
3. Find your rank

**✅ Success:** Your user appears on leaderboard

---

### 🧪 Test 7: Dashboard Overview (2 minutes)

1. Navigate to `/dashboard`
2. Verify all widgets:
   - Level & XP progress bar
   - Skill tree circular indicators
   - Recommended games
   - Recent activity feed
   - Quick action buttons

**✅ Success:** Dashboard is fully functional

---

## Part 6: Known Issues & Workarounds

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check MongoDB is running
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongodb

# If not running, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongodb           # Linux
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find and kill process using port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env:
PORT=5001
```

### Issue: Frontend won't start (port 3000 in use)
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or frontend will ask if you want to use different port (say yes)
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Assessment results not saving
**Solution:**
- Check backend console for errors
- Verify MongoDB connection
- Check browser console (F12) for API errors
- Try re-running `npm run seed`

---

## Part 7: Beta Testing Focus Areas

### What to Test Specifically:

#### 1. **Adaptive Difficulty** ⭐⭐⭐
- Play the same game type 3-5 times
- Notice if difficulty increases when you do well
- Notice if difficulty decreases when struggling
- **Target:** 75% accuracy (optimal flow state)

#### 2. **Achievement Unlocking** ⭐⭐⭐
- Complete various activities
- Check `/achievements` for newly unlocked
- Verify progress bars update
- Test different categories

#### 3. **Progress Tracking** ⭐⭐
- Play multiple games
- Check if stats update in `/progress`
- Verify charts display correctly
- Check cognitive growth tracking

#### 4. **UI/UX Experience** ⭐⭐
- Test on mobile (responsive design)
- Check all animations and transitions
- Verify loading states
- Test error messages

#### 5. **Performance** ⭐
- Check page load times
- Test game rendering speed
- Monitor memory usage
- Check for lag during gameplay

---

## Part 8: Providing Feedback

### Bug Report Template:
```markdown
**Bug:** [Brief description]
**Location:** [Which page/feature]
**Steps to reproduce:**
1.
2.
3.

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Browser:** [Chrome/Firefox/Safari/etc]
**Screenshots:** [If applicable]
```

### Feature Feedback Template:
```markdown
**Feature:** [What you tested]
**Liked:**
-
-

**Needs improvement:**
-
-

**Suggestions:**
-
```

---

## Part 9: Advanced Testing (Optional)

### Test Multiple User Accounts
```bash
# Create 3 different users with different ages:
# User 1: Age 3-6 (test child interface)
# User 2: Age 13-18 (test teen interface)
# User 3: Age 25-64 (test adult interface)

# Compare:
# - Question difficulty
# - UI complexity
# - Recommended games
```

### Test Edge Cases
- Try completing assessment with all wrong answers
- Try completing game session without answering
- Test with slow internet (Chrome DevTools → Network → Slow 3G)
- Test with very fast answers (< 1 second)
- Test with very long sessions (30+ minutes)

### Stress Testing
```bash
# Create 10 game sessions rapidly
# Check if:
# - Database handles concurrent writes
# - XP calculations are correct
# - Achievement unlocking doesn't duplicate
```

---

## Part 10: Production Deployment Preview

Once beta testing is complete, you can deploy to:

### Frontend (Choose one):
- **Vercel** (recommended): `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS Amplify**: Connect GitHub repo

### Backend (Choose one):
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Heroku**: `heroku create && git push heroku main`
- **AWS Elastic Beanstalk**: `eb create && eb deploy`

### Database:
- **MongoDB Atlas**: Already set up if using cloud option
- **Or migrate local MongoDB to Atlas**

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| MongoDB won't connect | Check service is running: `brew services list` |
| Backend crashes on start | Check `.env` file exists, verify MongoDB URI |
| Frontend shows blank page | Check browser console, verify API URL in `.env` |
| Games won't load | Backend not running, check http://localhost:5000/api/health |
| Achievements not unlocking | Re-run `npm run seed`, check backend console |
| Can't register user | Check MongoDB connection, verify email format |
| Slow performance | Clear browser cache, check MongoDB indexes |

---

## Expected Beta Performance Metrics

### Load Times (on local machine):
- Dashboard: < 1 second
- Game load: < 2 seconds
- Assessment load: < 1 second
- Progress charts: < 2 seconds

### Database Performance:
- Achievement query: < 50ms
- User progress query: < 100ms
- Game session creation: < 200ms
- Leaderboard query: < 300ms

### Game Performance:
- Frame rate: 60 FPS
- Answer submission: < 200ms
- Difficulty adjustment: Real-time
- XP calculation: Instant

---

## Success Criteria for Beta

✅ **Minimal Viable Beta:**
- [ ] Users can register and login
- [ ] Assessment completes and shows results
- [ ] At least 3 game types work
- [ ] Progress tracks correctly
- [ ] Achievements unlock
- [ ] Dashboard displays data

✅ **Full Feature Beta:**
- [ ] All 7 game types functional
- [ ] Adaptive difficulty working
- [ ] All pages load and work
- [ ] Mobile responsive
- [ ] No critical bugs
- [ ] Performance acceptable

✅ **Production Ready:**
- [ ] All features tested
- [ ] Security verified
- [ ] Performance optimized
- [ ] User feedback incorporated
- [ ] Documentation complete
- [ ] Deployment tested

---

## Next Steps After Beta

1. **Collect Feedback** (1-2 weeks)
   - Use beta testing checklist
   - Document all bugs and suggestions
   - Prioritize fixes

2. **Iterate** (1 week)
   - Fix critical bugs
   - Implement high-priority features
   - Optimize performance

3. **Polish** (1 week)
   - UI/UX improvements
   - Add missing features
   - Write comprehensive tests

4. **Deploy** (1-2 days)
   - Set up production environment
   - Configure CI/CD
   - Launch! 🚀

---

## Contact & Support

**Issues during beta?**
- Check this guide first
- Review backend console logs
- Check browser console (F12)
- Review DATABASE_SETUP.md for database issues
- Review FRONTEND_COMPLETE.md for UI issues

**For major issues:**
- Document the bug with screenshots
- Include console logs
- Note your environment (OS, browser, Node version)

---

## Quick Start Summary

```bash
# 1. Install MongoDB (see Part 1)

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Seed database
cd backend && npm run seed

# 4. Start backend (Terminal 1)
npm run dev

# 5. Start frontend (Terminal 2)
cd ../frontend && npm start

# 6. Open browser
# → http://localhost:3000

# 7. Start testing!
```

---

**🎉 You're ready to launch the CogniQuest beta!**

Have fun testing, and remember: this platform is designed to help humans thrive alongside AI. Every bug you find helps make that mission stronger! 💪🧠🤖

**Let's make cognitive training awesome!** 🚀
