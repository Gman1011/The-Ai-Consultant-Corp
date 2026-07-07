import { renderMedia } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const renderVideo = async (composition, options = {}) => {
  const {
    outputPath = path.join(__dirname, '../../out/video.mp4'),
    fps = 30,
    width = 1920,
    height = 1080,
    durationInFrames = 150,
  } = options;

  try {
    const result = await renderMedia({
      composition: composition,
      serveUrl: 'http://localhost:3000',
      codec: 'h264',
      crf: 18,
      outputLocation: outputPath,
      fps,
      width,
      height,
      durationInFrames,
    });

    const videoUrl = `/videos/${composition}.mp4`;

    return {
      success: true,
      path: videoUrl,
      url: videoUrl,
      message: `Video rendered successfully`,
    };
  } catch (error) {
    console.error('Video rendering error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getCompositionConfig = (compositionId) => {
  const compositions = {
    SampleVideo: {
      fps: 30,
      width: 1920,
      height: 1080,
      durationInFrames: 150,
    },
    StatsVideo: {
      fps: 30,
      width: 1920,
      height: 1080,
      durationInFrames: 300,
    },
    SocialMediaCard: {
      fps: 30,
      width: 1200,
      height: 630,
      durationInFrames: 240,
    },
  };

  return compositions[compositionId] || null;
};
