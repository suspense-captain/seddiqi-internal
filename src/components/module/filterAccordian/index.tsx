import React, { useContext, useEffect } from "react";
import styles from "./filterAccordian.module.scss";
import { ArrowDown } from "@assets/images/svg";
import Typography from "../typography";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";
import { LanguageContext } from "@contexts/languageContext";

const FilterAccordionItem = ({ title, children, onClear, selectedCount, isOpen, onToggle }) => {
  const handleClear = (event) => {
    event.stopPropagation();

    if (onClear) {
      onClear();
    }
  };

  const formattedCount = selectedCount < 10 ? `0${selectedCount}` : selectedCount;

  const { language } = useContext(LanguageContext);
  const texts = findABoutiqueListingStaticData[language]

  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.open : ""}`}>
      <div className={styles.accordionHeader} onClick={onToggle}>
        <Typography
          align="left"
          variant="p"
          className={styles.accordionHeaderText}
        >
          {title}
        </Typography>
        <div className={styles.iconGroup}>
          <div className={styles.clearTextContainer} onClick={handleClear}>
            <Typography align="left" variant="p" className={styles.clearText}>
              ({formattedCount}) {texts?.clearLabel}
            </Typography>
          </div>
          <ArrowDown
            className={`${styles.arrow} ${isOpen ? styles.rotate : ""}`}
          />
        </div>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
};

const FilterAccordian = ({ children }) => {
  return <div className={styles.accordion}>{children}</div>;
};

export { FilterAccordian, FilterAccordionItem };
