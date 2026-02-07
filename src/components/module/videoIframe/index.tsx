import React, { useState, useMemo } from "react";
import { PlayIcon } from "@assets/images/svg";
import styles from "./videoIframe.module.scss";
import { convertYouTubeUrl, isYoutube } from "@utils/cms/helpers/convertYouTubeUrl";

const VideoIframe = ({ iframeUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [isYoutubeLink, setIsYoutubeLink] = useState(false);

  if (!iframeUrl) return null;
  
  

  const baseEmbedUrl = useMemo(() => {
    try {
      const urlObj = new URL(iframeUrl);
      const embedUrl = convertYouTubeUrl(urlObj);
  
      setIsYoutubeLink(isYoutube(urlObj));

      return embedUrl;
    } catch {
      return iframeUrl;
    }
  }, [iframeUrl]);

  const autoplayUrl = useMemo(() => {
    try {
      const urlObj = new URL(baseEmbedUrl);
      urlObj.searchParams.set("autoplay", "1");
      return urlObj.toString();
    } catch {
      return iframeUrl;
    }
  }, [baseEmbedUrl, iframeUrl]);

  React.useEffect(() => {
    setIframeSrc(baseEmbedUrl);
  }, [baseEmbedUrl]);

  const handlePlayClick = () => {
    setIframeSrc(autoplayUrl);
    setIsPlaying(true);
  };

  return (
    <div className={styles.videoIframeWrapper}>
      <iframe
        src={iframeSrc}
        title="video-player"
        frameBorder="0"
        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      {!isPlaying && !isYoutubeLink && (
        <div className={styles.overlay} onClick={handlePlayClick}>
          <PlayIcon className={styles.playIcon} />
        </div>
      )}
    </div>
  );
};

export default VideoIframe;
