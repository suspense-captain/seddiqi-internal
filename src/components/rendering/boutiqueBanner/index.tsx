import React from "react";
import styles from "./boutiqueBanner.module.scss";
import Typography from "../../module/typography";
import RichText from "../../module/richText";
import { Image } from "@components/module";
import Video from "@components/module/video";
import Button from "../../module/button";
import { BoutiqueBannerProps } from "@utils/models";

const BoutiqueBanner: React.FC<BoutiqueBannerProps> = ({
  backgroundColor,
  cta,
  mainTitle,
  media,
  richText,
}) => {
  const bgClass =
    backgroundColor === "primary"
      ? styles.primaryBackground
      : backgroundColor === "secondary"
      ? styles.secondaryBackground
      : styles.defaultBackground;

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  return (
    <div className={`${styles.boutiqueBannerContainer} ${bgClass}`}>
      <div className={styles.innerContainer}>
        <div className={styles.mediaContainer}>
          {media?.image ? (
            <Image image={media.image} imageAltText={media.altText} poiAspect={poiAspect}/>
          ) : media?.video ? (
            <Video
              video={media.video}
              autoPlay={media.autoPlay}
              showPlay={media.showPlay}
            />
          ) : null}
        </div>
        <div className={styles.contentContainer}>
          <Typography variant="h2" className={styles.title}>
            {mainTitle?.toUpperCase()}
          </Typography>
          <div className={styles.richTextContainer}>
            <RichText align="" text={richText} />
          </div>
          {cta && cta.label && (
            <div className={styles.ctaContainer}>
              <Button
                title={cta?.label}
                type={cta?.type}
                color={cta?.color}
                link={cta?.url}
                new_tab={cta?.isNewTab}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoutiqueBanner;
