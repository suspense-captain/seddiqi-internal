import React from "react";
import Script from "next/script";
import styles from "./popupContent.module.scss";
import { Typography } from "@components/module";

interface PopupContentProps {
  headerText: string;
  subText: string;
}

const PopupContent: React.FC<PopupContentProps> = ({ headerText, subText }) => {
  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://platform-api.sharethis.com/js/sharethis.js#property=67d90b7e86189a0019fafcb0&product=image-share-buttons"
        async
      />
      <div className={styles.contentContainer}>
        <div className={styles.popupText}>
        {headerText && (
          <Typography variant="h6" className={styles.popupHeader}>
            {headerText}
          </Typography>
            )}
          {subText && <p className={styles.popupSubtext}>{subText}</p>}
        </div>
        <div className={styles.bar}></div>
        <div className={styles.iconContainer}>
          <div className="sharethis-inline-share-buttons"></div>
        </div>
      </div>
    </>
  );
};

export default PopupContent;
