import React from 'react';
import { Composition } from 'remotion';
import { SampleVideo } from './SampleVideo';
import { StatsVideo } from './StatsVideo';
import { SocialMediaCard } from './SocialMediaCard';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SampleVideo"
        component={SampleVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StatsVideo"
        component={StatsVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SocialMediaCard"
        component={SocialMediaCard}
        durationInFrames={240}
        fps={30}
        width={1200}
        height={630}
      />
    </>
  );
};
