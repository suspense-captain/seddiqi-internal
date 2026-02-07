import React, { useContext } from "react";
import SlidingRadioSwitch from "@components/module/slidingRadioSwitch";
import styles from "./toggleMapResults.module.scss";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";
import { LanguageContext } from "@contexts/languageContext";

const ToggleMapResults = ({ onToggle, activeTab, storeCounts }) => {
  const count = storeCounts[activeTab] || 0;

  const { language } = useContext(LanguageContext);


  const texts = findABoutiqueListingStaticData[language]

  return (
    <div className={styles.toggleResultsContainer}>
      {/* <SlidingRadioSwitch toggleLabel={"Map View"} onToggle={onToggle} /> */}
      <span></span>
      <p className={styles.storeResult}>
        {storeCounts[activeTab] > 10 ? storeCounts[activeTab] : "0" + count} {texts?.resultsLabel}
      </p>
    </div>
  );
};

export default ToggleMapResults;