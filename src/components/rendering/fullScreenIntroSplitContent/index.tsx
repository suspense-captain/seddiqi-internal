import { Button, GradientOverlay, Image, Video } from "@components/module";
import React, { memo, useEffect, useState } from "react";
import styles from "./fullscreenIntroSplitContent.module.scss";

const FullScreenIntroWithSplitContent = ({ ...content }) => {
  const [showMedia, setShowMedia] = useState(true);
  const [animateImages, setAnimateImages] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const MediaItem = memo(
    ({
      item,
      animateImages,
      side,
    }: {
      item: any;
      animateImages: any;
      side: any;
    }) => {
      let position = item?.position?.toLowerCase();
      const [isHovered, setIsHovered] = useState(false);
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);

      return (
        <div
          className={`${
            animateImages
              ? styles[
                  `slideIn${side?.charAt(0)?.toUpperCase() + side?.slice(1)}`
                ]
              : ""
          } ${styles[`${side}ImageContainer`]}  ${styles.imageContainer}`}
        >
          <div 
            onMouseEnter={handleMouseEnter}  
            onMouseLeave={handleMouseLeave} 
            className={styles.hovere}>
            <GradientOverlay
              className={`${styles[`${side}Image`]}`}
              opacity={60}
            >
              {item?.media?.image ? (
                <Image
                  className={`${styles.image} ${styles[`${side}Image`]}`}
                  height={styles.image1}
                  image={item?.media?.image}
                  imageAltText={`${side} image`}
                />
              ) : (
                <Video
                  video={item?.media?.video}
                  className={`${styles.image} ${styles[`${side}Image`]}`}
                  showPlay={item?.media?.showPlay}
                  autoPlay={isHovered ? false : item?.media?.autoPlay}
                />
              )}
            </GradientOverlay>

            <div className={`${styles[position]} ${styles.textContainer}`}>
              {item?.title && <h2 className={styles.title}>{item?.title}</h2>}
              <div className={styles.descContainer}>
                {item?.description && (
                  <div className={styles.desc}>{item?.description}</div>
                )}

                <div className={styles.btnContainer}>
                  <Button
                    className={`${styles.discoverBtn} ${item?.cta?.color === "white" ? styles.whiteHover : ""}`}
                    title={item?.cta?.label}
                    isLink={false}
                    type={item?.cta?.type}
                    color={item?.cta?.color}
                    new_tab={item?.cta?.isNewTab}
                    link={item?.cta?.url}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.media}>
        {showMedia && (
          <GradientOverlay opacity={60}>
            {content?.fullScreenIntro?.media?.image ? (
              <Image
                className={`${styles.media} ${styles.fadeOut}`}
                image={content?.fullScreenIntro?.media?.image}
                imageAltText={content?.fullScreenIntro?.media?.altText}
              />
            ) : (
              <Video
                className={`${styles.media} ${styles.fadeOut}`}
                video={content?.fullScreenIntro?.media?.video}
                autoPlay={content?.fullScreenIntro?.media?.autoPlay}
                showPlay={content?.fullScreenIntro?.media?.showPlay}
              />
            )}
            {content?.fullScreenIntro?.mainTitle && (
              <h1 className={styles.heading}>
                {content?.fullScreenIntro?.mainTitle}
              </h1>
            )}
          </GradientOverlay>
        )}

        <div className={styles.imagesContainer}>
          <MediaItem
            item={content?.leftItem}
            animateImages={animationComplete}
            side="left"
          />
          <MediaItem
            item={content?.rightItem}
            animateImages={animationComplete}
            side="right"
          />
        </div>
      </div>
    </div>
  );
};

export default FullScreenIntroWithSplitContent;
