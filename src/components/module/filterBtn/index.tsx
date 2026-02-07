import React from "react";
import styles from "./filterBtn.module.scss";
import { FilterIcon } from "@assets/images/svg";

const FilterBtn = ({ label, icon = false, onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      {icon && <FilterIcon />}
      <div className={styles.text}>{label && label}</div>
    </div>
  );
};

export default FilterBtn;
