import { WhatsappIcon } from "@assets/images/svg";
import React, { useEffect, useState } from "react";
import styles from "./stickyWhatsapp.module.scss";

const StickyWhatsapp = () => {
  return (
    <div className={styles.container}>
      <WhatsappIcon />
    </div>
  );
};

export default StickyWhatsapp;
