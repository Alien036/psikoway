"use client";

import React, { useState, useRef } from "react";

interface BackgroundVideoProps {
  src?: string;
}

export default function BackgroundVideo({ src = "/arkaplan.mp4" }: BackgroundVideoProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    setVideoEnded(true);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Video son 0.3 saniyeye girdiğinde yumuşak kararma ve kehribar arka plan geçişini başlat
    if (video.duration > 0 && video.currentTime >= video.duration - 0.3) {
      setVideoEnded(true);
    }
  };

  return (
    <>
      {/* 1. Kehribar Turuncusu Koyu Arka Plan (Video bitince pürüzsüzce belirir) */}
      <div 
        className={`amber-dark-backdrop ${videoEnded ? "active" : ""}`} 
        aria-hidden="true" 
      />

      {/* 2. Sinematik Arka Plan Videosu (Bitince tamamen kaybolur) */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        className={`video-bg ${videoEnded ? "video-finished" : ""}`}
        aria-hidden="true"
      />

      {/* 3. Şık Karartma / Atmosfer Katmanı */}
      <div 
        className={`video-overlay ${videoEnded ? "overlay-amber-tint" : ""}`} 
        aria-hidden="true" 
      />
    </>
  );
}
