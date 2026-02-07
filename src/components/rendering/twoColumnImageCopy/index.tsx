import React from "react";
import Image from "@components/module/image";
import { Button, ContentHeader, Video, Typography } from "@components/module";
import styles from "./twoColumnImageCopy.module.scss";
import RichText from "@components/module/richText";

const TwoColumnImageCopy = ({ contentLeft, contentRight }) => {
  const leftCta = contentLeft?.cta;
  const rightCta = contentRight?.cta;
  const poiAspect = { sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1" };

  return (
    <div className={styles.container}>
      <div className={styles.columnOne}>
        {contentLeft?.label && (
          <div className={styles.label}>
            <Typography align="center" variant="p" className={styles.labeltext}>
              {contentLeft?.label || "Article"}
            </Typography>
          </div>
        )}
        <div className={styles.containerWrapper}>
          <ContentHeader
            barColor={styles.barColor}
            subTitleColor={styles.subTitleColor}
            titleColor={styles.titleColor}
            hideUnderline={contentLeft?.hideUnderline}
            mainTitle={contentLeft?.heading}
            richText={contentLeft?.description}
          />
          {leftCta && leftCta?.label && leftCta?.label?.length > 0 && (
            <Button
              isLink={true}
              link={leftCta?.url}
              className={styles.discoverBtn}
              title={leftCta?.label}
              color={leftCta?.color}
              type={leftCta?.type}
              new_tab={leftCta?.isNewTab}
            />
          )}
        </div>
        {contentLeft?.media?.image ? (
          <Image
            className={styles.image}
            height={styles.image}
            image={contentLeft?.media?.image}
            imageAltText={"watch"}
            poiAspect={poiAspect}
          />
        ) : (
          <Video
            className={styles.image}
            video={contentLeft?.media?.video}
            autoPlay={contentLeft?.media?.autoPlay}
            showPlay={contentLeft?.media?.showPlay}
          />
        )}
      </div>
      <div className={styles.columnTwo}>
        {contentRight?.media?.image ? (
          <Image
            className={styles.image}
            height={styles.image}
            image={contentRight?.media?.image}
            imageAltText={"watch"}
            poiAspect={poiAspect}
          />
        ) : (
          <Video
            className={styles.image}
            video={contentRight?.media?.video}
            autoPlay={contentRight?.media?.autoPlay}
            showPlay={contentRight?.media?.showPlay}
          />
        )}
        {contentRight?.label && (
          <div className={styles.label}>
            <Typography align="center" variant="p" className={styles.labeltext}>
              {contentRight?.label || "Article"}
            </Typography>
          </div>
        )}

        <div className={styles.columnContent}>
          <ContentHeader
            barColor={styles.barColor}
            subTitleColor={styles.subTitleColor}
            titleColor={styles.titleColor}
            hideUnderline={contentRight?.hideUnderline}
            mainTitle={contentRight?.heading}
          />
          <div className={styles.headingSecondary}>
            <RichText
              align=""
              className={styles.desc}
              text={contentRight?.description}
            />
          </div>
          {rightCta && rightCta?.label && rightCta?.label?.length > 0 && (
            <Button
              isLink={true}
              link={rightCta?.url}
              className={styles.discoverBtn}
              title={rightCta?.label}
              color={rightCta?.color}
              type={rightCta?.type}
              new_tab={rightCta?.isNewTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnImageCopy;
