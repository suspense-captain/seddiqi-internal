import React from "react";
import styles from "./twoColumnArticleBlockV2.module.scss";
import Image from "@components/module/image";
import { Button, GradientOverlay, Typography, Video } from "@components/module";
import RichText from "@components/module/richText";
import { useDeviceWidth } from "@utils/useCustomHooks";

const TwoColumnArticleBlockV2 = ({ content, mainTitle }) => {
  if (!content) return null;

  const poiAspect = { sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1" };

  const isDesktop = useDeviceWidth()[0]

  const renderColumn = (content) => {
    const opacity = content?.opacity?.opacity;
    return (
      <div className={styles.column}>
        <GradientOverlay className={styles.gradient} opacity={opacity}>
          {content?.media?.image ? (
            <Image
              height={styles.image}
              className={`${styles.image}`}
              image={isDesktop ? content?.media?.image : content?.mobileMedia?.image || content?.media?.image}
              imageAltText={content?.media?.altText}
              poiAspect={poiAspect}
            />
          ) : (
            <Video 
              video={isDesktop ? content?.media?.video : content?.mobileMedia?.video || content?.media?.video}
              autoPlay={isDesktop ? content?.media?.autoPlay : content?.mobileMedia?.autoPlay || content?.media?.autoPlay}
              showPlay={isDesktop ? content?.media?.showPlay : content?.mobileMedia?.showPlay || content?.media?.showPlay}
            />
          )}
        </GradientOverlay>
        <div className={styles.articleInfo}>
          {content?.label && (
            <div className={styles.label}>{content?.label}</div>
          )}
          {content?.heading && (
            <Typography variant="h4" className={styles.headingPrimary}>
              {content?.heading}
            </Typography>
          )}

          {content?.description && (
            <div className={styles.description}>
              <RichText align="" text={content?.description} />
            </div>
          )}

          {content?.cta && content?.cta?.label && (
            <Button
              isLink={content?.cta?.isNewTab}
              link={content?.cta?.url}
              className={styles.btn}
              title={content?.cta?.label}
              color={content?.cta?.color}
              type={content?.cta?.type}
            />
          )}
          <span></span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wholeContainer}>
      {mainTitle && (
        <Typography variant="h2" className={styles.mainTitle}>
          {mainTitle}
        </Typography>
      )}
      <div className={styles.container}>
        <div className={`${styles.containerColumns} ${
            content.length === 1 ? styles.singleColumn : ""
          }`}
        >
          {content?.map((item) => renderColumn(item))}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnArticleBlockV2;
