import React from "react";
import styles from "./twoColumnOurServices.module.scss";
import { Image, Typography } from "@components/module";
import { useDeviceWidth } from "@utils/useCustomHooks";
import RichText from "@components/module/richText";

const TwoColumnOurServices = (content) => {
  const { rowItems, title, subTitle, hideUnderline, backgroundColor="cream" } = content;
  const poiAspect = { sm: "3:2", md: "3:2", lg: "3:2", xl: "3:2" };

  const normalizedBackgroundColor = backgroundColor?.toLowerCase();

  const backgroundClass =
    normalizedBackgroundColor === "white" ? styles.white : styles.cream;

  return (
    <div className={`${styles.servicesSection} ${backgroundClass}`}>
      <div className={styles.headerSections}>
        {title && (
          <Typography variant="h2" className={styles.title}>
            {title}
          </Typography>
        )}
        {!hideUnderline && (
          <div className={`customBarColor ${styles.bar}`}>&nbsp;</div>
        )}
        {subTitle && (
          <Typography variant="p" className={styles.subTitle}>
            {subTitle}
          </Typography>
        )}
      </div>

      <div className={styles.cardSection}>
        {rowItems.length &&
          rowItems.map((item, index) => {
            return (
              <div key={index} className={styles.stepItem}>
                <Image
                  className={styles.image}
                  image={item?.image?.image}
                  imageAltText={item?.image?.altText}
                  poiAspect={poiAspect}
                />
                <div
                  className={styles.text}
                  style={{ textAlign: item.titleAlignment || "left" }}
                >
                  {item?.label && (
                    <Typography variant="h4" className={styles.stepNumber}>
                      {item?.label}
                    </Typography>
                  )}

                  <Typography variant="h2" className={styles.textTitle}>
                    {item?.title}
                  </Typography>
                  <div className={styles.description}>
                    {item.richText && (
                      <RichText align="" text={item?.richText} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TwoColumnOurServices;
