# Remotion Video Generation Setup

This project is now configured to generate videos programmatically using Remotion, a React-based video creation framework.

## Installation

```bash
cd backend
npm install
```

## Project Structure

- `src/compositions/` - Remotion video compositions
  - `index.js` - Main composition registry
  - `SampleVideo.js` - Example video component
- `src/services/videoService.js` - Video rendering service
- `src/routes/videos.js` - API endpoints for video generation
- `remotion.config.js` - Remotion configuration

## Creating Videos

### 1. Create a Composition Component

Create a new file in `src/compositions/`, e.g., `MyVideo.js`:

```javascript
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

export const MyVideo = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontSize: 80 }}>Your Video Here</div>
    </AbsoluteFill>
  );
};
```

### 2. Register the Composition

Add it to `src/compositions/index.js`:

```javascript
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>
```

### 3. Render via API

Send a POST request to `/api/videos/render`:

```json
{
  "compositionId": "MyVideo",
  "options": {
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "durationInFrames": 150
  }
}
```

## Command Line Usage

Render a video directly:

```bash
npm run render
```

## Key Remotion Features

- **Interpolation**: Animate values over time
- **Easing Functions**: Create smooth, realistic animations
- **useFrame**: Access current frame for frame-by-frame control
- **useVideoConfig**: Get video settings (fps, duration, etc.)
- **Audio Support**: Add audio tracks to videos
- **Sequences**: Layer and time multiple compositions

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Examples](https://www.remotion.dev/docs/composition)
- [Animation Guide](https://www.remotion.dev/docs/interpolate)
