import React from "react";
import styles from "./loader.module.scss";

const Loader = ({ localContainerLoading = false, height = '100%' }) => {
  const position = localContainerLoading ? 'absolute' : 'fixed';

  return (
    <div className={styles.loaderOverlay} style={{
      position,
      height
    }}>
      <div className={styles.loaderSpinner}></div>
    </div>
  );
};

export default Loader;
