import { EditIcon, MapIcon } from "@assets/images/svg";
import styles from "./selectedLocation.module.scss";
import { useContext } from "react";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import Typography from "@components/module/typography";

const SelectedLocation = () => {
  const { selectedCard, updateStep, handleStepChange, setSelectedCard, selectedStore, setCompletedSteps } =
    useContext(BookAppointmentContext);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.locationDetails}>
          <div className={styles.header}>
            <Typography variant="h2" className={styles.title}>
              Ahmed Seddiqi
            </Typography>
            <div
              onClick={() => {
                handleStepChange(3);
                updateStep(3, false);
                setCompletedSteps([true, true, false, false, false]);
              }}
            >
              <EditIcon className={styles.editIcon} />
            </div>
          </div>

          <p>
            <span className={styles.icon}>
              <MapIcon />
            </span>
            {selectedStore ? `${selectedStore.city} | ${selectedStore.name}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectedLocation;
