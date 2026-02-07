import React, { useContext } from "react";
import styles from "./selectedCard.module.scss";
import Image from "@components/module/image";
import { EditIcon } from "@assets/images/svg";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";

const SelectedCard = () => {
  const { selectedCard, updateStep, handleStepChange, setSelectedCard, setCompletedSteps } = useContext(BookAppointmentContext);
  if (!selectedCard) return null;
  return (
    <div className={`${styles.serviceCard}`}>
      <Image
        className={`${true && styles.serviceImg} ${styles.serviceImage}`}
        image={selectedCard?.media?.image}
        imageAltText={selectedCard?.media?.altText}
      />
      <div className={styles.serviceInfo}>
        <div className={styles.serviceTitle}>{selectedCard?.title}</div>
        <div className={styles.serviceDesc}>{selectedCard?.description}</div>
      </div>
      <div
        onClick={() => {
          handleStepChange(1);
          setSelectedCard(null);
          updateStep(1, false);
          setCompletedSteps([true, false, false, false, false]);
        }}
        className={styles.closeIconContainer}
      >
        <EditIcon className={styles.closeIcon} />
      </div>
    </div>
  );
};

export default SelectedCard;
