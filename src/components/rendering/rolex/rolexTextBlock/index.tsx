import React from "react";
import styles from "./rolexTextBlock.module.scss";
import RichText from "@components/module/richText";
import { Typography } from "@components/module";

const RolexTextBlock = ({ className = "", ...content }) => {
  if (!content) return null;

  const contentToUse = content.content || content;

  if (contentToUse?.type?.toLowerCase() === "rolex") {
    return (
      <div className={`${styles.banner} ${styles[className]}`}>
        <div className={styles.bannerContainer}>
          {contentToUse?.title && (
            <div className={styles.leftText}>
              <Typography variant="h1" className={styles.title}>
                {contentToUse?.title}
              </Typography>
            </div>
          )}
          {contentToUse?.description && (
            <div className={styles.rightText}>
              <RichText align="" className={`${styles.headingSecondary}`} text={contentToUse?.description} />
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`${styles.bannerCpo} ${styles[className]}`}>
        <div className={styles.bannerContainerCpo}>
          {contentToUse?.label && <div className={styles.label}>{contentToUse?.label}</div>}
          {contentToUse?.title && (
            <div className={styles.leftText}>
              <Typography variant="h1" className={styles.title}>
                {contentToUse?.title}
              </Typography>
            </div>
          )}

          {contentToUse?.description && (
            <div className={styles.rightText}>
              <RichText align="" className={`${styles.headingSecondary}`} text={contentToUse?.description} />
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default RolexTextBlock;
