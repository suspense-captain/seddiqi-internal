import React from "react";
import styles from "./spacing.module.scss";

const Spacing = ({ desktopHeight = 60, mobileHeight = 30, backgroundColor = "white", ...content }) => {
  const spacerStyle = {
    "--spacer-desktop-height": `${desktopHeight}px`,
    "--spacer-mobile-height": `${mobileHeight}px`,
  };

  return (
    <div className={`${styles[backgroundColor]} ${styles.spacing}`} style={spacerStyle as React.CSSProperties}></div>
  );
};

export default Spacing;
