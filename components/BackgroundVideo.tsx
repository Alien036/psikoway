"use client";

import React, { useState, useRef, useEffect } from "react";

interface BackgroundVideoProps {
  src?: string;
}

export default function BackgroundVideo({ src = "/arkaplan.mp4" }: BackgroundVideoProps) {
  // Varsayılan olarak true başlatıp yalnızca masaüstünde ilk açılışta videoyu oynatıyoruz;
  // böylece mobilde ve sayfa geçişlerinde tam ekran video decode kaynaklı kasma tamamen engellenir.
  const [videoEnded, setVideoEnded] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem("psikoway_bg_video_played") === "1";

    if (isMobile || prefersReducedMotion || alreadyPlayed) {
      setVideoEnded(true);
    } else {
      setVideoEnded(false);
    }
  }, []);

  const markVideoFinished = () => {
    setVideoEnded(true);
    try {
      sessionStorage.setItem("psikoway_bg_video_played", "1");
    } catch {}
  };

  const handleEnded = () => {
    markVideoFinished();
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Video son 0.3 saniyeye girdiğinde yumuşak kararma ve kehribar arka plan geçişini başlat
    if (video.duration > 0 && video.currentTime >= video.duration - 0.3) {
      markVideoFinished();
    }
  };

  return (
    <>
      {/* 1. Kehribar Turuncusu Koyu Arka Plan (Video bitince pürüzsüzce belirir) */}
      <div 
        className={`amber-dark-backdrop ${videoEnded ? "active" : ""}`} 
        aria-hidden="true" 
      />

      {/* 2. Sinematik Arka Plan Videosu (Bitince DOM'dan tamamen kaldırılır, GPU yormaz) */}
      {!videoEnded && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          className="video-bg"
          aria-hidden="true"
        />
      )}

      {/* 3. Şık Karartma / Atmosfer Katmanı */}
      <div 
        className={`video-overlay ${videoEnded ? "overlay-amber-tint" : ""}`} 
        aria-hidden="true" 
      />
    </>
  );
}

