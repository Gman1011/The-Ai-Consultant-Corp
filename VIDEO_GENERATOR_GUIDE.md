# Video Generator - Full Integration Guide

Your video generation system is now fully integrated into the frontend! Here's how to get it running.

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Servers

**In Terminal 1 - Backend (from `/backend`):**
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

**In Terminal 2 - Frontend (from `/frontend`):**
```bash
npm start
```
Frontend runs on `http://localhost:3000`

### 3. Access the Video Generator

1. Open `http://localhost:3000` in your browser
2. Click on **"🎬 Video Generator"** in the navbar
3. You'll see three video templates ready to use

## 📹 Available Templates

### StatsVideo (Default)
- **Type:** Animated metrics display
- **Duration:** 10 seconds
- **Resolution:** 1920x1080 (Full HD)
- **Features:**
  - 3 animated stat cards
  - Spring physics animations
  - Number counters (0→value)
  - Staggered entrance effects
- **Perfect for:** Marketing videos, performance reports, company announcements

### SocialMediaCard
- **Type:** Product promotion
- **Duration:** 8 seconds
- **Resolution:** 1200x630 (Social media optimized)
- **Features:**
  - Slide-in animations
  - Pulsing CTA button
  - Professional layout
  - Feature list
- **Perfect for:** LinkedIn, Twitter, Instagram ads

### SampleVideo
- **Type:** Intro animation
- **Duration:** 5 seconds
- **Resolution:** 1920x1080
- **Features:**
  - Text scaling effect
  - Smooth fade animations
  - Simple but elegant
- **Perfect for:** Logo reveals, titles

## 🎬 How to Use

### Step-by-Step:

1. **Select a Template**
   - Click on any of the three cards on the left
   - The selected template will highlight in blue

2. **Generate the Video**
   - Click the "🎥 Generate Video" button
   - You'll see a loading spinner while rendering
   - This typically takes 10-20 seconds

3. **Preview the Video**
   - Once generated, the video appears in the player
   - You can play/pause and watch it in full screen

4. **Download**
   - Click "⬇️ Download Video" to save to your computer
   - Videos are saved as MP4 files

5. **Generate Another**
   - Click "Generate Another" to create a different video
   - Select a new template and repeat

## 📁 Project Structure

```
The-Ai-Consultant-Corp/
├── backend/
│   ├── src/
│   │   ├── compositions/          # Video templates
│   │   │   ├── index.js           # Composition registry
│   │   │   ├── SampleVideo.js     # Intro template
│   │   │   ├── StatsVideo.js      # Metrics template
│   │   │   └── SocialMediaCard.js # Social media template
│   │   ├── services/
│   │   │   └── videoService.js    # Video rendering logic
│   │   ├── routes/
│   │   │   └── videos.js          # API endpoints
│   │   └── server.js              # Express server
│   ├── out/                       # Generated videos
│   ├── package.json
│   └── REMOTION_SETUP.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── VideoGenerator.js  # Main UI page
│   │   ├── styles/
│   │   │   └── VideoGenerator.css # Styling
│   │   ├── components/
│   │   │   └── Navbar.js          # Updated with video link
│   │   └── App.js                 # Routes updated
│   └── package.json
```

## 🔌 API Endpoint

The backend exposes a video rendering endpoint:

**POST** `/api/videos/render`

**Request:**
```json
{
  "compositionId": "StatsVideo",
  "options": {
    "fps": 30,
    "width": 1920,
    "height": 1080
  }
}
```

**Response:**
```json
{
  "success": true,
  "path": "/videos/StatsVideo.mp4",
  "url": "/videos/StatsVideo.mp4",
  "message": "Video rendered successfully"
}
```

## 🎨 Customizing Videos

### Edit a Video Template

To customize the StatsVideo, edit `backend/src/compositions/StatsVideo.js`:

```javascript
// Change the stats displayed:
<StatCard number={500} label="Happy Clients" delay={1.3} ... />
<StatCard number={150} label="Projects Done" delay={1.6} ... />
```

### Create a New Template

1. Create a new file: `backend/src/compositions/MyVideo.js`
2. Build your video component using Remotion
3. Register it in `backend/src/compositions/index.js`
4. Update `backend/src/services/videoService.js`
5. Refresh the frontend!

## 🐛 Troubleshooting

### Videos not generating
- Check that backend is running on `http://localhost:5000`
- Verify the `/api/videos/render` endpoint is accessible
- Check browser console for network errors

### Videos not displaying
- Ensure backend is serving the `/videos` directory
- Check that `out/` folder exists in backend
- Verify CORS is enabled (already done in server.js)

### Memory issues
- Remotion rendering can be memory intensive
- For large batches, consider adding a queue system
- See `backend/REMOTION_SETUP.md` for optimization tips

## 🚀 Advanced Usage

### Batch Generation

You can generate multiple videos programmatically:

```javascript
const compositions = ['SampleVideo', 'StatsVideo', 'SocialMediaCard'];

for (const id of compositions) {
  const response = await fetch('/api/videos/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compositionId: id })
  });
  const data = await response.json();
  console.log(`Generated: ${data.url}`);
}
```

### Dynamic Content

Modify compositions to accept props:

```javascript
// Pass data when rendering
<Composition
  id="StatsVideo"
  component={StatsVideo}
  defaultProps={{
    stats: [
      { number: 1000, label: 'Users' },
      { number: 500, label: 'Videos' }
    ]
  }}
  ...
/>
```

### Cloud Deployment

When deploying:
1. Backend needs write access to `/out` directory
2. Frontend needs CORS properly configured
3. Consider using cloud storage (S3, GCS) for generated videos
4. Add cleanup jobs to remove old videos

## 📚 Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)

## ✨ Next Steps

1. ✅ Customize the video templates
2. ✅ Add user input forms for dynamic content
3. ✅ Integrate with your vendor database
4. ✅ Add email delivery of generated videos
5. ✅ Create templates for different use cases

## 📝 Notes

- Videos are rendered server-side for consistency
- Generated videos are stored in `backend/out/`
- Each render typically takes 10-20 seconds
- Video quality can be adjusted via CRF (Constant Rate Factor) setting
- Memory usage scales with video length and resolution

Enjoy creating videos with code! 🎬
