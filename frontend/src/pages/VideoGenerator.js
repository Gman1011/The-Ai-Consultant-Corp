import React, { useState } from 'react';
import '../styles/VideoGenerator.css';

const COMPOSITIONS = [
  {
    id: 'SampleVideo',
    name: 'Sample Intro',
    description: 'Beautiful intro animation with text effects',
    icon: '✨',
    duration: '5 sec',
    resolution: '1920x1080',
    features: ['Smooth animations', 'Text effects', 'Easing functions'],
  },
  {
    id: 'StatsVideo',
    name: 'Stats Dashboard',
    description: 'Animated metrics display with counters',
    icon: '📊',
    duration: '10 sec',
    resolution: '1920x1080',
    features: ['Spring physics', 'Number counters', 'Staggered animations'],
  },
  {
    id: 'SocialMediaCard',
    name: 'Social Media Card',
    description: 'Product promotion for social platforms',
    icon: '🎯',
    duration: '8 sec',
    resolution: '1200x630',
    features: ['Slide-in effects', 'Pulsing button', 'Optimized for social'],
  },
];

export default function VideoGenerator() {
  const [selectedComposition, setSelectedComposition] = useState('StatsVideo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [generatedTime, setGeneratedTime] = useState(null);

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/videos/render`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            compositionId: selectedComposition,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setVideoUrl(data.path);
        setGeneratedTime(new Date().toLocaleTimeString());
      } else {
        setError(data.error || 'Failed to generate video');
      }
    } catch (err) {
      setError(err.message || 'Error generating video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${selectedComposition}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="video-generator-container">
      {/* Header */}
      <div className="generator-header">
        <h1>🎬 Video Generator</h1>
        <p>Generate stunning videos with Remotion</p>
      </div>

      <div className="generator-content">
        {/* Left Side - Compositions */}
        <div className="compositions-section">
          <h2>Choose a Template</h2>
          <div className="compositions-grid">
            {COMPOSITIONS.map((comp) => (
              <div
                key={comp.id}
                className={`composition-card ${
                  selectedComposition === comp.id ? 'active' : ''
                }`}
                onClick={() => setSelectedComposition(comp.id)}
              >
                <div className="comp-icon">{comp.icon}</div>
                <div className="comp-name">{comp.name}</div>
                <div className="comp-description">{comp.description}</div>
                <div className="comp-specs">
                  <span className="spec-badge">{comp.duration}</span>
                  <span className="spec-badge">{comp.resolution}</span>
                </div>
                <ul className="comp-features">
                  {comp.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Preview & Controls */}
        <div className="preview-section">
          <div className="preview-box">
            {videoUrl ? (
              <div className="video-player">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div className="preview-placeholder">
                <div className="placeholder-icon">
                  {COMPOSITIONS.find((c) => c.id === selectedComposition)?.icon}
                </div>
                <p>{COMPOSITIONS.find((c) => c.id === selectedComposition)?.name}</p>
                <span>Click "Generate" to create video</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="controls-section">
            <button
              className={`generate-btn ${isGenerating ? 'loading' : ''}`}
              onClick={handleGenerateVideo}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                '🎥 Generate Video'
              )}
            </button>

            {error && <div className="error-message">{error}</div>}

            {videoUrl && (
              <div className="success-message">
                <span className="checkmark">✓</span>
                <div>
                  <p>Video generated successfully!</p>
                  <small>Generated at {generatedTime}</small>
                </div>
              </div>
            )}

            {videoUrl && (
              <button className="download-btn" onClick={handleDownload}>
                ⬇️ Download Video
              </button>
            )}

            {videoUrl && (
              <button
                className="reset-btn"
                onClick={() => {
                  setVideoUrl(null);
                  setError(null);
                }}
              >
                Generate Another
              </button>
            )}
          </div>

          {/* Info Box */}
          <div className="info-box">
            <h3>📋 How it works</h3>
            <ol>
              <li>Select a template from the left</li>
              <li>Click "Generate Video" to create it</li>
              <li>Preview the video in the player</li>
              <li>Download or generate another</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>✨ What's Possible</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Generation</h3>
            <p>Create professional videos in seconds</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Full Customization</h3>
            <p>Customize colors, text, and effects</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Multi-Format</h3>
            <p>Generate for any platform or resolution</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Automation Ready</h3>
            <p>Integrate with your API for bulk generation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
