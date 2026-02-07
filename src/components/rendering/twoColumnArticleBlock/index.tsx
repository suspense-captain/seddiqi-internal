import React from "react";
import styles from "./twoColumnArticleBlock.module.scss";
import Image from "@components/module/image";
import { Button, GradientOverlay, Typography } from "@components/module";
import RichText from "@components/module/richText";
import { useDeviceWidth } from "@utils/useCustomHooks";

const TwoColumnArticleBlock = ({ contentLeft, contentRight }) => {
  if (!contentLeft || !contentRight) return null;

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  const renderColumn = (content) => {
    const opacity = content?.opacity?.opacity;

    const isDesktop = useDeviceWidth()[0]
    const image = isDesktop ? content?.image?.image : content?.mobileMedia?.image || content?.image?.image

    return (
      <div className={styles.column}>
        <GradientOverlay className={styles.gradient} opacity={opacity}>
          <Image
            height={styles.image}
            className={styles.image}
            image={image}
            imageAltText={content?.image?.altText}
            poiAspect={poiAspect}
          />
        </GradientOverlay>
        <div className={styles.articleInfo}>
          {/* <div className={styles.label}>Article</div> */}
          <Typography variant="h4" className={styles.headingPrimary}>
            {content?.heading}
          </Typography>
          <div className={styles.description}>
            <RichText align="" text={content?.description} />
          </div>
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
    <div className={styles.container}>
      <div className={styles.containerColumns}>
        {renderColumn(contentLeft)}
        {renderColumn(contentRight)}
      </div>
    </div>
  );
};

export default TwoColumnArticleBlock;
