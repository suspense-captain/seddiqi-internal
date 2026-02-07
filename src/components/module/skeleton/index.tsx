import React, { useState } from "react";
import styles from "./skeleton.module.scss";

const Skeleton = () => {
  return (
    <div className="card__body body__img">
      <img className={styles.skeleton} alt="" id="skeleton-img" />
    </div>
  );
};
export default Skeleton;