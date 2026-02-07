import React from "react";
import styles from "./brandBanner.module.scss";
import Typography from "../../module/typography";
import RichText from "../../module/richText";
import { Image, Video } from "@components/module";
import { BrandBannerProps } from "@utils/models";
import BrandBannerIcon from "@assets/images/svg/BrandBannerIcon";

const BrandBanner: React.FC<BrandBannerProps> = ({
  mainTitle,
  media,
  richText,
  ...content
}) => {
  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  const isSansArabic = content?.mainTitleFont?.mainTitleFont === "The Sans Arabic"


  return (
    <div className={styles.brandBannerContainer}>
      <div className={styles.brandBannerIcon}>
        <BrandBannerIcon />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.innerContent}>
          <Typography variant="h2" className={`${isSansArabic && styles.sansArabicTitle} ${styles.title}`}>
            {mainTitle?.toUpperCase()}
          </Typography>
          <div className={styles.richTextContainer}>
            <RichText align="" text={richText} />
          </div>
        </div>
      </div>
      <div className={styles.mediaContainer}>
        {media?.video ? (
          <Video
            video={media.video}
            autoPlay={media.autoPlay}
            showPlay={media.showPlay}
          />
        ) : (
          <Image image={media.image} imageAltText={media.altText} poiAspect={poiAspect}/>
        )}
      </div>
    </div>
  );
};

export default BrandBanner;
