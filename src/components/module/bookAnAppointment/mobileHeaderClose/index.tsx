import React from "react";
import styles from "./mobileHeaderClose.module.scss";
import { CloseIconV2 } from "@assets/images/svg";
import Link from "next/link";

const MobileHeaderClose = ({ url }) => {
  return (
    <div className={styles.heading}>
      <div className={styles.title}>Book an appointment</div>
      <Link style={{ display: "flex" }} href={url ? url : "/"}>
        <CloseIconV2 />
      </Link>
    </div>
  );
};

export default MobileHeaderClose;
