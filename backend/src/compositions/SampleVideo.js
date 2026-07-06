import React from 'react';
import { useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';

export const SampleVideo = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = 0; // In real usage, this would be provided by Remotion

  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [0.5, 1],
    {
      easing: Easing.out(Easing.quad),
    }
  );

  const opacity = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [0, 1, 0]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontSize: 100,
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Welcome to Remotion!
      </div>
    </AbsoluteFill>
  );
};
