import React from 'react';
import {
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
  Sequence,
  spring,
} from 'remotion';

const StatCard = ({ number, label, delay, frame, durationInFrames }) => {
  const fps = 30;
  const frameWithDelay = Math.max(0, frame - delay * fps);
  const progress = frameWithDelay / (durationInFrames - delay * fps);

  const springValue = spring({
    frame: frameWithDelay,
    fps: 30,
    config: { damping: 5, mass: 0.5, overshootClamping: false },
    durationInFrames: 20,
  });

  const scale = progress < 0.3 ? springValue * 1.2 : 1;
  const opacity = interpolate(frameWithDelay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numberDisplay = Math.floor(interpolate(
    frameWithDelay,
    [0, 30],
    [0, number],
    { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
  ));

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transform: `scale(${scale})`,
        opacity,
        transition: 'transform 0.3s ease',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 'bold', color: '#00ff88', marginBottom: '10px' }}>
        {numberDisplay}+
      </div>
      <div style={{ fontSize: 20, color: '#aaa', fontWeight: '500' }}>
        {label}
      </div>
    </div>
  );
};

export const StatsVideo = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleScale = interpolate(frame, [0, 30], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  const cardsOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomTextOpacity = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
          top: '-200px',
          right: '-200px',
          opacity: interpolate(frame, [0, durationInFrames], [0.5, 0.2]),
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          bottom: '-200px',
          left: '-200px',
          opacity: interpolate(frame, [0, durationInFrames], [0.3, 0.5]),
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px',
          width: '90%',
          maxWidth: '1000px',
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: '800',
              color: '#fff',
              margin: 0,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #fff 0%, #00ff88 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Impact
          </h1>
          <p
            style={{
              fontSize: 20,
              color: '#888',
              margin: '20px 0 0 0',
              textAlign: 'center',
            }}
          >
            Real numbers, real growth
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px',
            width: '100%',
            opacity: cardsOpacity,
          }}
        >
          <StatCard
            number={500}
            label="Happy Clients"
            delay={1.3}
            frame={frame}
            durationInFrames={durationInFrames}
          />
          <StatCard
            number={150}
            label="Projects Completed"
            delay={1.6}
            frame={frame}
            durationInFrames={durationInFrames}
          />
          <StatCard
            number={99}
            label="Success Rate"
            delay={1.9}
            frame={frame}
            durationInFrames={durationInFrames}
          />
        </div>

        {/* Bottom text */}
        <div
          style={{
            opacity: bottomTextOpacity,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: '#aaa',
              margin: 0,
            }}
          >
            Join thousands of businesses transforming their digital presence
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
