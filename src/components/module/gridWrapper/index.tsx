import { useDeviceWidth } from "@utils/useCustomHooks";
import React from "react";
import styles from "./gridWrapper.module.scss";

const GridWrapper = ({ children }) => {
  return (
    <div
      className={styles.container}
    >
      {children && children}
    </div>
  );
};

export default GridWrapper;
