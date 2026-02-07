import React, { useContext } from "react";
import {
  LanguageContext,
  LANGUAGE_DICT,
  COUNTRY_DICT,
  COUNTRY_DICT_ARABIC,
} from "@contexts/languageContext";
import styles from "./languageSelector.module.scss";
import { ArrowDown } from "@assets/images/svg";
import { languageSelectorStaticData } from "@utils/data/english-arabic-static-data";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { language, country, handleLanguageChange, handleCountryChange } =
    useContext(LanguageContext);

  const isArabic = language?.toLowerCase()?.includes("ar")

  return (
    <div className={`${styles.selection} ${className}`}>
      <label className={styles.label}>
        {languageSelectorStaticData[language]?.label}
      </label>
      <div className={styles.dropdowns}>
        <div className={`${styles.dropdown} ${styles.countryDropdown}`}>
          <div className={styles.customSelect}>
            <select
              onChange={(e) => handleCountryChange?.(language.split('-')[0], e.target.value.toLowerCase())}
              value={country.toLowerCase() || "ae"}
            >
              {Object.entries(isArabic ? COUNTRY_DICT_ARABIC : COUNTRY_DICT).map(([key, name]) => (
                <option key={key} value={key.toLowerCase()}>
                  {name}
                </option>
              ))}
            </select>
            <ArrowDown className={styles.arrow} />
          </div>
        </div>
        <div className={`${styles.dropdown} ${styles.languageDropdown}`}>
          <div className={styles.customSelect}>
            <select
              onChange={(e) => handleLanguageChange?.(e.target.value.toLowerCase(), country.toLowerCase())}
              value={language.split("-")[0] || "en"}
              disabled={country.toLowerCase() === "ae"}
            >
              {Object.entries(LANGUAGE_DICT).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
            <ArrowDown className={styles.arrow} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
