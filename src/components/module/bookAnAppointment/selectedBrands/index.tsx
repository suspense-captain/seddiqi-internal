import React, { useContext } from "react";
import styles from "./selectedBrands.module.scss";
import { EditIcon } from "@assets/images/svg";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";

const SelectedBrands = () => {
  const { selectedWatches, selectedJewellery, handleStepChange, setSelectedStore, updateStep, setCompletedSteps } = useContext(BookAppointmentContext);

  const isNoBrandsSelected = (!selectedWatches || selectedWatches.length === 0) && (!selectedJewellery || selectedJewellery.length === 0);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.selectedBrands}>
        {isNoBrandsSelected ? (
          <div>No Brands Selected</div>
        ) : (
          <>
            {selectedWatches?.map((brand, index) => (
              <div className={styles.brand} key={brand}>
                {brand}
                {index < selectedWatches.length - 1 ? ", " : ""}
              </div>
            ))}

            {selectedJewellery?.map((brand, index) => (
              <div className={styles.brand} key={brand}>
                {brand}
                {index < selectedJewellery.length - 1 ? ", " : ""}
              </div>
            ))}
          </>
        )}
      </div>
      <div
        onClick={() => {
          handleStepChange(2);
          setSelectedStore(null);
          updateStep(2, false);
          setCompletedSteps([true, false, false, false, false]);
        }}
        className={styles.closeIconContainer}
      >
        <EditIcon className={styles.closeIcon} />
      </div>
    </div>
  );
};

export default SelectedBrands;
