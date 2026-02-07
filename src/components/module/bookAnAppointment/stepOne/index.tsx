import React, { useContext } from "react";
import styles from "./index.module.scss";
import ExclusiveInfoCards from "../exclusiveInfoCards";
import ServiceCard from "../serviceCard";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";

const StepOne = ({ content }) => {
  if (!content) return null;

  const { updateStep, handleStepChange, setSelectedCard } = useContext(BookAppointmentContext);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.title}>{content?.title}</div>
        <div className={styles.desc}>{content?.description}</div>
      </div>

      <div className={styles.serviceCards}>
        {content?.listItems?.map((item) => (
          <div
            onClick={() => {
              setSelectedCard(item);
              handleStepChange(2);
              updateStep(1, true);
            }}
          >
            <ServiceCard handleStepChange={handleStepChange} setSelectedCard={setSelectedCard} item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepOne;
