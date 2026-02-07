import React from "react";
import styles from "./productBadge.module.scss";

interface Props {
  tagText: String;
}

const ProductBadge = ({ tagText }: Props) => {
  return (
    <div className={styles.stockContainer}>
      <div className={styles.stock}>{tagText}</div>
    </div>
  );
};

export default ProductBadge;
