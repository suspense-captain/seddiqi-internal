import React from "react";
import styles from "./contentHeader.module.scss";

import Typography from "../typography";
import RichText from "../richText";
import { ContentHeaderProps } from "@utils/models";

const ContentHeader: React.FC<ContentHeaderProps> = ({
  titleColor = "",
  subTitleColor = "",
  barColor = "",
  mainTitle = "",
  hideUnderline = true,
  richText = "",
  textColor = "",
}) => {
  if (!mainTitle && !richText) {
    return null;
  }
  return (
    <div className={styles.containerHeader}>
      {mainTitle && (
        <Typography
          textColor={textColor}
          variant="h2"
          className={`${styles.headingPrimary} ${titleColor} ${textColor} `}
        >
          {mainTitle}
        </Typography>
      )}
      {!hideUnderline && <div className={`customBarColor ${styles.bar} ${barColor}`}>&nbsp;</div>}
      {richText && (
        <div style={{ color: textColor }} className={`${styles.headingSecondary} ${subTitleColor}`}>
          <RichText align="" className={`${styles.headingSecondary} ${subTitleColor}`} text={richText} />
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
