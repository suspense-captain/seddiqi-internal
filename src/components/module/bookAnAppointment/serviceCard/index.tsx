import { Image } from "@components/module";
import React from "react";
import styles from "./serviceCard.module.scss";
import { CloseIcon } from "@assets/images/svg";

const ServiceCard = ({ className = "", item, type = false, handleStepChange, setSelectedCard }) => {
  return (
    <div className={`${className} ${styles.serviceCard}`}>
      <Image
        className={`${type && styles.serviceImg} ${styles.serviceImage}`}
        image={item?.media?.image}
        imageAltText={item?.media?.altText}
      />
      <div className={styles.serviceInfo}>
        <div className={styles.serviceTitle}>{item?.title}</div>
        <div className={styles.serviceDesc}>{item?.description}</div>
      </div>
      {type && (
        <div
          onClick={() => {
            handleStepChange(1);
            setSelectedCard(null);
          }}
        >
          <CloseIcon className={styles.closeIcon} />
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
