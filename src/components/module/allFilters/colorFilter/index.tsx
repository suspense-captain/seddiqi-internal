import React, { useState } from "react";
import styles from "./colorFilter.module.scss";
import Typography from "@components/module/typography";
import { Ellipse } from "@assets/images/svg";

const colorOptions = [
  { label: "Beige", color: "#F5F5DC" },
  { label: "Black", color: "#000000" },
  { label: "Blue", color: "#0000FF" },
  { label: "Brown", color: "#A52A2A" },
  { label: "Gold", color: "#FFD700" },
  { label: "Grey/ Anthracite", color: "#808080" },
  { label: "Orange", color: "#FFA500" },
];

const ColorFilter = () => {
  const [selectedColors, setSelectedColors] = useState([]);

  const handleOptionChange = (color) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.includes(color)
        ? prevSelectedColors.filter((c) => c !== color)
        : [...prevSelectedColors, color]
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.colorGroup}>
        {colorOptions.map((option) => (
          <label key={option.label} className={styles.colorLabel}>
            <input
              type="checkbox"
              value={option.label}
              checked={selectedColors.includes(option.label)}
              onChange={() => handleOptionChange(option.label)}
              className={styles.colorInput}
            />
            <div className={styles.colorContainer}>
              {selectedColors.includes(option.label) && (
                <Ellipse className={styles.colorEllipse} />
              )}
              <div
                className={styles.customColor}
                style={{ backgroundColor: option.color }}
              />
            </div>
            <Typography align="left" variant="p" className={styles.title}>
              {option.label}
            </Typography>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
