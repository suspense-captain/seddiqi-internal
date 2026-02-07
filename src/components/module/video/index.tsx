import React, { useEffect, useRef, useState } from "react";
import styles from "./video.module.scss";
import classNames from "classnames";
import VideoPlay from "@assets/images/svg/VideoPlay";
import VideoPause from "@assets/images/svg/VideoPause";

const Video = ({ video, className = "", autoPlay = true, showPlay = true }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && autoPlay) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (videoRef.current) {
      const videoElement = videoRef.current;

      // Manually check visibility on first load
      if (videoElement.readyState > 0 && autoPlay) {
        const rect = videoElement.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setIsPlaying(true);
        }
      }

      videoElement.addEventListener("ended", () => setIsPlaying(false));
      observer.observe(videoElement);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [autoPlay]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const toggleMuteUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted((prevIsMuted) => !prevIsMuted);
    }
  };

  return (
    <div className={classNames(styles.videoPlayerWrapper, className)}>
      {video && (
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          autoPlay={autoPlay}
          playsInline
          className={styles.videoPlayer}
          style={{
            background: "#000101",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          poster={`https://${video.defaultHost}/v/${video.endpoint}/${video.name}?protocol=https`}
          src={`https://${video.defaultHost}/v/${video.endpoint}/${video.name}/mp4_720p?protocol=https`}
        >
          <source
            src={`https://${video.defaultHost}/v/${video.endpoint}/${video.name}/mp4_720p?protocol=https`}
            data-res="High"
            data-bitrate="2119"
            data-label="High"
            type="video/mpeg4"
          />
          <source
            src={`https://${video.defaultHost}/v/${video.endpoint}/${video.name}/mp4_480p?protocol=https`}
            data-res="Medium"
            data-bitrate="689"
            data-label="Medium"
            type="video/mpeg4"
          />
          <source
            src={`https://${video.defaultHost}/v/${video.endpoint}/${video.name}/webm_480p?protocol=https`}
            data-res="Medium"
            data-bitrate="624"
            data-label="Medium"
            type="video/webm"
          />
        </video>
      )}

      <div className={styles.actionButtonContainer}>
        {(showPlay) && (
          <div
            className={styles.actionButtonAlignment}
            onClick={togglePlayPause}
          >
            {isPlaying ? <VideoPause /> : <VideoPlay />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
