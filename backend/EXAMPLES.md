# Remotion Video Examples

This guide showcases what's possible with Remotion and the three example compositions included in this project.

## Available Compositions

### 1. **SampleVideo** - Basic Animation Example
**Duration:** 5 seconds (150 frames @ 30fps)  
**Resolution:** 1920x1080 (Full HD)

**What it demonstrates:**
- Text animation with scaling and opacity
- Easing functions (smooth motion)
- Frame interpolation
- Color gradients

**Use case:** Simple intro or logo reveal animations

**Try it:**
```bash
curl -X POST http://localhost:3000/api/videos/render \
  -H "Content-Type: application/json" \
  -d '{"compositionId": "SampleVideo"}'
```

---

### 2. **StatsVideo** - Animated Metrics Display
**Duration:** 10 seconds (300 frames @ 30fps)  
**Resolution:** 1920x1080 (Full HD)

**What it demonstrates:**
- Sequential animations (staggered timing)
- Spring physics animations
- Number counter animations
- Animated background elements
- Multi-layer composition
- Complex easing patterns

**Features:**
- 3 animated stat cards with staggered entrance
- Glowing background elements
- Smooth number transitions (0 → value)
- Title animation with scale effect
- Exit animation (fade out)

**Use case:** 
- Marketing videos
- Performance reports
- Company announcements
- Product launches
- Social media content

**Real-world example:**
```javascript
// You can customize the stats:
<StatCard number={500} label="Happy Clients" />
<StatCard number={150} label="Projects Done" />
<StatCard number={99} label="Success Rate" />
```

**Try it:**
```bash
curl -X POST http://localhost:3000/api/videos/render \
  -H "Content-Type: application/json" \
  -d '{"compositionId": "StatsVideo"}'
```

---

### 3. **SocialMediaCard** - Product Promotion Card
**Duration:** 8 seconds (240 frames @ 30fps)  
**Resolution:** 1200x630 (Instagram, LinkedIn, Twitter)

**What it demonstrates:**
- Slide-in animations from different directions
- Button with pulse effect
- Interactive UI elements
- Animated background patterns
- Responsive text layout
- Box shadow effects
- Gradient overlays

**Features:**
- Left side: Title, description, feature list, CTA button
- Right side: Animated visual card with emoji and pattern
- Entrance animations (staggered by element)
- Button pulse effect after appearing
- Exit animation at the end

**Use case:**
- Social media content (LinkedIn, Twitter, Instagram)
- Product landing page videos
- Feature announcements
- Marketing emails
- Ad creatives
- SaaS product promotions

**Try it:**
```bash
curl -X POST http://localhost:3000/api/videos/render \
  -H "Content-Type: application/json" \
  -d '{"compositionId": "SocialMediaCard"}'
```

---

## Key Remotion Concepts Used

### 1. **Interpolation** - Smooth Value Changes
```javascript
const opacity = interpolate(frame, [0, 30], [0, 1]);
// Fades in from frame 0 to 30
```

### 2. **Spring Physics** - Natural Motion
```javascript
const scale = spring({ frame, fps: 30, config: { mass: 0.5 } });
// Creates bouncy, organic animations
```

### 3. **useCurrentFrame** - Frame-based Control
```javascript
const frame = useCurrentFrame();
// Access current frame (0, 1, 2, ... durationInFrames)
```

### 4. **Easing Functions** - Professional Motion
```javascript
easing: Easing.out(Easing.cubic) // Ease out cubic
easing: Easing.out(Easing.back)  // Bounce effect
```

### 5. **Sequences** - Timing Multiple Elements
```javascript
const cardDelay = 1.3; // Start 1.3 seconds in
const frameWithDelay = frame - (cardDelay * fps);
```

---

## API Usage

All compositions are available via the `/api/videos/render` endpoint.

### Basic Request
```bash
curl -X POST http://localhost:3000/api/videos/render \
  -H "Content-Type: application/json" \
  -d '{"compositionId": "StatsVideo"}'
```

### Response
```json
{
  "success": true,
  "path": "/path/to/backend/out/video.mp4",
  "message": "Video rendered successfully"
}
```

### With Custom Options
```bash
curl -X POST http://localhost:3000/api/videos/render \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "SocialMediaCard",
    "options": {
      "fps": 60,
      "width": 1920,
      "height": 1080
    }
  }'
```

---

## Creating Your Own Composition

### Step 1: Create a Component
```javascript
// src/compositions/MyVideo.js
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ background: '#000', opacity }}>
      <div style={{ color: '#fff', fontSize: 100 }}>
        Your Video Content
      </div>
    </AbsoluteFill>
  );
};
```

### Step 2: Register It
```javascript
// src/compositions/index.js
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>
```

### Step 3: Update the Service
```javascript
// src/services/videoService.js
MyVideo: {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 150,
}
```

### Step 4: Render It
```bash
curl -X POST http://localhost:3000/api/videos/render \
  -H "Content-Type: application/json" \
  -d '{"compositionId": "MyVideo"}'
```

---

## Advanced Patterns

### Animated Counter
```javascript
const numberDisplay = Math.floor(
  interpolate(frame, [0, 30], [0, targetNumber])
);
```

### Pulsing Effect
```javascript
const pulse = interpolate(
  Math.sin((frame / fps) * 3 * Math.PI) * 50,
  [-50, 50],
  [0.95, 1.05]
);
```

### Staggered Animations
```javascript
const delay = elementIndex * 0.3; // 300ms between elements
const frameWithDelay = Math.max(0, frame - delay * fps);
```

### Gradient Text
```javascript
style={{
  background: 'linear-gradient(135deg, #fff 0%, #00ff88 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}
```

---

## Performance Tips

1. **Use interpolate with extrapolateRight: 'clamp'** to stop animations at the end
2. **Memoize expensive calculations** for smooth rendering
3. **Use spring() for natural motion** instead of linear interpolation
4. **Batch multiple animations** in same component when possible
5. **Test locally** with `remotion preview` before rendering

---

## Output Formats

Videos render as MP4 (H.264 codec) by default. You can customize:
- Resolution (1920x1080, 1200x630, etc.)
- Frame rate (30fps, 60fps, etc.)
- Quality (CRF value, default 18)
- Duration

---

## Next Steps

1. ✅ Create custom video compositions
2. ✅ Integrate with your API
3. ✅ Generate videos on-demand for users
4. ✅ Store videos in a database or cloud storage
5. ✅ Serve videos from your frontend

For more advanced features, check the [Remotion documentation](https://www.remotion.dev/docs).
