import React from 'react';
import {
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
} from 'remotion';

export const SocialMediaCard = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  // Main content slide in from left
  const contentTranslate = interpolate(frame, [0, 30], [-100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  // Image slide in from right
  const imageTranslate = interpolate(frame, [10, 40], [100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  // CTA button appears and scales
  const ctaScale = interpolate(frame, [50, 70], [0.5, 1], {
    easing: Easing.out(Easing.back),
    extrapolateRight: 'clamp',
  });

  const ctaOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Pulse effect on button
  const pulse = interpolate(
    Math.sin((frame / fps) * 3 * Math.PI) * 50,
    [-50, 50],
    [0.95, 1.05]
  );

  const buttonScale = frame > 70 ? 1 + (pulse - 1) * 0.1 : 1;

  // Exit animation
  const exitOpacity = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '600px',
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* Left Content */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${contentTranslate}px)`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#00bfa5',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            Featured
          </div>

          <h2
            style={{
              fontSize: 42,
              fontWeight: '700',
              color: '#1a1a1a',
              margin: '0 0 16px 0',
              lineHeight: '1.2',
            }}
          >
            Create Videos With Code
          </h2>

          <p
            style={{
              fontSize: 16,
              color: '#555',
              margin: '0 0 24px 0',
              lineHeight: '1.6',
            }}
          >
            Generate stunning videos programmatically using React components and Remotion.
          </p>

          {/* Features List */}
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 32px 0',
            }}
          >
            {['100% Code-Based', 'Real-Time Preview', 'Full Control'].map((feature, i) => (
              <li
                key={i}
                style={{
                  fontSize: 14,
                  color: '#333',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#00bfa5', fontWeight: 'bold' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            style={{
              padding: '14px 32px',
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
              background: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transform: `scale(${buttonScale})`,
              opacity: ctaOpacity,
              boxShadow: '0 4px 15px rgba(0, 191, 165, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            Get Started
          </button>
        </div>

        {/* Right - Visual Element */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${imageTranslate}px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '280px',
              height: '280px',
              background: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Animated background pattern */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    left: `${20 + i * 70}px`,
                    top: `${40 + Math.sin((frame / fps + i) * 2) * 30}px`,
                  }}
                />
              ))}
            </div>

            {/* Center Content */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 60,
                  marginBottom: '16px',
                }}
              >
                🎬
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#fff',
                }}
              >
                Remotion
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginTop: '8px',
                }}
              >
                Video as Code
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
