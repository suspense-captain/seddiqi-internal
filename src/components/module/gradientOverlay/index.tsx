import React from "react";
import styles from "./gradientOverlay.module.scss";

const GradientOverlay = ({ children, opacity = 0, className = "", heightClass="" }) => {

  const rgbaOpacity = opacity / 100;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, ${rgbaOpacity}) 0%, rgba(0, 0, 0, ${rgbaOpacity}) 100%),
                      linear-gradient(0deg, rgba(0, 0, 0, ${rgbaOpacity}) 0%, rgba(0, 0, 0, ${rgbaOpacity}) 100%)`,
    zIndex: 100,
    opacity: rgbaOpacity, // Ensure this is a valid number between 0 and 1
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {children}
      <div style={backgroundStyle} className={`${heightClass} ${styles.gradientOverlay}`}></div>
    </div>
  );
};

export default GradientOverlay;
