# Claude Code Configuration

## Project Overview

Food Truck Finder App - A full-stack application for food truck vendors and customers with real-time location tracking and map integration.

## Remotion Video Generation Skill

This project includes support for creating videos programmatically using [Remotion](https://www.remotion.dev/), a JavaScript library for creating videos with React.

### Setup

To use Remotion in this project:

1. **Install Remotion** (in the frontend or a new `videos` directory):
```bash
npx create-remotion-app@latest
# or
npm install remotion @react-three/fiber three
```

2. **Create a `videos` directory** (optional) for video composition code:
```bash
mkdir -p videos/src/compositions
```

### Using Remotion

Create video compositions using React components. Example:

```javascript
// videos/src/compositions/FoodTruckPromo.tsx
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';

export const FoodTruckPromo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <div style={{ opacity, fontSize: 60, textAlign: 'center', paddingTop: 100 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};
```

Render videos with the Remotion CLI:
```bash
npx remotion render videos/src/compositions/FoodTruckPromo.tsx output.mp4
```

### Use Cases for This Project

- **Vendor Marketing Videos**: Generate promotional videos for food truck vendors
- **Location Update Notifications**: Create animated videos showing daily location changes
- **Customer Testimonials**: Automate video creation from customer reviews
- **Social Media Content**: Generate clips for TikTok, Instagram Reels, etc.

### Key Files

- `SETUP.md` - Backend and frontend setup instructions
- `API.md` - REST API documentation
- `backend/` - Node.js/Express server
- `frontend/` - React client application

### Development Tips

- Use Remotion's `@react-three/fiber` for 3D animations
- Leverage the Google Maps integration to visualize food truck locations
- Use the Vendor and Location data models for dynamic video content
- Test videos in Remotion's preview before rendering

### Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion YouTube Guide](https://www.remotion.dev/learn)
- [API Reference](https://www.remotion.dev/docs/api)

---

**Last Updated**: 2026-07-06
**Tech Stack**: React 18, Node.js/Express, MongoDB, Google Maps API, Remotion
