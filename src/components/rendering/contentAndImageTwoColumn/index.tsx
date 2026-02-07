import React from "react";
import styles from "./contentAndImageTwoColumn.module.scss";
import { ContentAndImageTwoColumnProps } from "@utils/models/contentAndImageTwoColumn";
import { Typography } from "@components/module";
import RichText from "../../module/richText";
import { Image } from "@components/module";
import { BackgroundStyle } from "@utils/helpers/backgroundStyle";
import { Button } from "@components/module";

const ContentAndImageTwoColumn: React.FC<ContentAndImageTwoColumnProps> = ({
  leftColumn,
  rightColumn,
  reverse,
  backgroundColor,
  cta,
  isSquareImage,
}) => {
  const { title = "", description = "" } = leftColumn || {};

  const { backgroundStyle } = BackgroundStyle({ backgroundColor }) || {};

  const hasCta = !!(leftColumn?.cta?.label && leftColumn?.cta?.type);

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  const isSansArabic = leftColumn?.mainTitleFont?.mainTitleFont === "The Sans Arabic"

  return (
    <div
      className={`${styles.contentAndImageContainer} ${
        reverse ? styles.reversed : ""
      } ${backgroundStyle || ""}`}
    >
      <div
        className={`${styles.contentWrapper} ${
          isSquareImage ? styles.squareImageLayout : ""
        }`}
      >
        <div className={styles.contentWrapper}>
          <div
            className={`${styles.leftContent} ${
              isSquareImage ? styles.square : ""
            }`}
          >
            {title && (
              <Typography variant="h2" className={`${isSansArabic && styles.sansArabicTitle} ${styles.title}`}>
                {title}
              </Typography>
            )}
            {description && (
              <div className={styles.description}>
                <RichText align="" text={description} />
              </div>
            )}
            {hasCta && (
              <div className={styles.ctaContainer}>
                <Button
                  isLink={true}
                  className={styles.btnStyle}
                  title={leftColumn?.cta?.label}
                  color={leftColumn?.cta?.color}
                  type={leftColumn?.cta?.type}
                  new_tab={leftColumn?.cta?.isNewTab}
                />
              </div>
            )}
          </div>
          <div
            className={`${styles.rightContent} ${
              isSquareImage ? styles.square : ""
            }`}
          >
            {rightColumn?.image && (
              <Image
                image={rightColumn?.image}
                imageAltText={rightColumn?.image.name}
                className={
                  isSquareImage ? styles.squareImage : styles.rectangularImage
                }
                poiAspect={poiAspect}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAndImageTwoColumn;
