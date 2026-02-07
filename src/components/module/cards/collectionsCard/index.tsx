import React from "react";
import styles from "./collectionsCard.module.scss";
import Image from "@components/module/image";
import Video from "@components/module/video";
import GradientOverlay from "@components/module/gradientOverlay";
import { useDeviceWidth } from "@utils/useCustomHooks";

const CollectionsCard = ({ item, type, totalItems, hideUnderline }) => {
  const isProduct = type?.toLowerCase() === "product";
  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  const isDesktop = useDeviceWidth()[0]
    
  return (
    <div
      key={item?.title}
      className={`${isProduct && styles.productItem} ${totalItems <= 4 && styles.collectionHeight} ${styles.item}`}
    >
      <GradientOverlay className={styles.gradient} opacity={item?.opacity?.opacity}>
        {item?.media?.image ? (
          <Image
            className={`${isProduct && styles.productImg} ${styles.image}`}
            image={isDesktop ? item?.media?.image : item?.mobileMedia?.image || item?.media?.image}
            imageAltText={item.media.altText}
            height={styles.height}
            poiAspect={poiAspect}
          />
        ) : item?.media?.video ? (
          <div className={styles.videoContainer}>
            <Video 
              className={styles.video} video={isDesktop ? item?.media?.video : item?.mobileMedia?.video || item?.media?.video}
              autoPlay={isDesktop ? item?.media?.autoPlay : item?.mobileMedia?.autoPlay || item?.media?.autoPlay}
              showPlay={isDesktop ? item?.media?.showPlay : item?.mobileMedia?.showPlay || item?.media?.showPlay} 
            />
          </div>
        ) : null}
      </GradientOverlay>
      <div className={`${isProduct && styles.productContent} ${styles.itemContent}`}>
        {item?.title && <div className={styles.category}>{item?.title}</div> }
        {item?.cta?.label && <div className={styles.title}>{item?.cta?.label}</div> }
        {!hideUnderline && <div className={styles.itemBar}>&nbsp;</div>}
      </div>
    </div>
  );
};

export default CollectionsCard;
