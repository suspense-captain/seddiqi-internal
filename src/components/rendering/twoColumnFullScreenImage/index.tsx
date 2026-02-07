import React from "react";
import styles from "./twoColumnFullScreenImage.module.scss";
import { ContentHeader, GradientOverlay, Image } from "@components/module";
import { useDeviceWidth } from "@utils/useCustomHooks";

const TwoColumnFullScreenImage = ({ ...content }) => {
  let leftImage = content?.imageLeft?.image?.image;
  let rightImage = content?.imageRight?.image?.image;
  const isSingleColumn = !leftImage || !rightImage;

  const leftMobileImage = content?.mobileLeftImage?.media?.image;
  const rightMobileImage = content?.mobileRightImage?.media?.image;

  const isDesktop = useDeviceWidth();
  const displayLeftImage = isDesktop[0] ? leftImage : leftMobileImage ? leftMobileImage : leftImage
  const displayRightImage = isDesktop[0] ? rightImage : rightMobileImage ? rightMobileImage : rightImage

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  return (
    <div className={styles.container}>
      <ContentHeader
        barColor={styles.barColor}
        subTitleColor={styles.subTitleColor}
        titleColor={styles.titleColor}
        hideUnderline={content?.hideUnderline}
        mainTitle={content?.mainTItle}
        richText={content?.description}
      />
      <div style={{ gridTemplateColumns: isSingleColumn && "1fr" }} className={styles.containerImgs}>
        <GradientOverlay opacity={content?.imageLeft?.opacity?.opacity}>
          <Image
            height={`${isSingleColumn && styles.imgHeight} ${styles.image}`}
            className={`${isSingleColumn && styles.imgHeight} ${styles.image}`}
            image={displayLeftImage}
            imageAltText={leftImage?.altText}
            poiAspect={poiAspect}
          />
        </GradientOverlay>
        <GradientOverlay opacity={content?.imageRight?.opacity?.opacity}>
          <Image
            height={`${isSingleColumn && styles.imgHeight} ${styles.image}`}
            className={`${isSingleColumn && styles.imgHeight} ${styles.image}`}
            image={displayRightImage}
            imageAltText={rightImage?.altText}
            poiAspect={poiAspect}
          />
        </GradientOverlay>
      </div>
    </div>
  );
};

export default TwoColumnFullScreenImage;
