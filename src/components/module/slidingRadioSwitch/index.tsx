import React, { useState } from "react";
import styles from "./slidingRadioSwitch.module.scss";

const SlidingRadioSwitch = ({ toggleLabel, onToggle, value = false, noToggle = false }) => {
  const [checkedValue, setCheckedValued] = useState<boolean>(value);

  return (
    <div className={styles.switchContainer}>
      <p className={styles.toggleLabel}>{toggleLabel}</p>

      <label className={styles.switch}>
        <input
          type="checkbox"
          name="toggle"
          onChange={() => {
            if (!noToggle) {
              onToggle(checkedValue);
              setCheckedValued((prevIndex) => (prevIndex === false ? true : false));
            }
          }}
          className={styles.switchInput}
          checked={checkedValue}
        />
        <span className={`${[styles.slider]} ${[styles.round]}`}></span>
      </label>
    </div>
  );
};

export default SlidingRadioSwitch;
