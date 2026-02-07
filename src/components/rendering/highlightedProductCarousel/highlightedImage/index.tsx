import { GradientOverlay, Image } from "@components/module";
import React from "react";

import styles from "./highlightedImage.module.scss";

const HighlightedImage = ({ media, opacity }) => {
  return (
    <GradientOverlay opacity={opacity?.opacity} className={styles.imgContainer}>
      <Image height={styles.leftImage} className={styles.leftImage} image={media?.image} imageAltText={media?.altText} />
    </GradientOverlay>
  );
};

export default HighlightedImage;
