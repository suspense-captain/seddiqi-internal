import React, { useContext, useState } from "react";
import styles from "./checkboxFilter.module.scss";
import Typography from "../typography";
import { Tickbox, SearchIcon, Tick } from "@assets/images/svg";
import { useContent } from "@contexts/withVisualizationContext";
import { LanguageContext } from "@contexts/languageContext";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";

interface CheckboxFilterProps {
  title: string;
  options: string[];
  hasSearch?: boolean;
  onOptionChange: (filterKey: string, option: string) => void;
  selectedOptions: string[];
  filterKey: string;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  title,
  options,
  hasSearch,
  onOptionChange,
  selectedOptions,
  filterKey,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onOptionChange(filterKey, value);
  };

  const handleViewMore = () => {
    setShowAll(!showAll);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getUniqueOptions = (optionsList) => {
	  const seen = new Map();

    optionsList.forEach(option => {
      const lowerOption = option.toLowerCase();
      const isCamelCase = option !== lowerOption;

      if (!seen.has(lowerOption)) {
        seen.set(lowerOption, option);
      } else if (isCamelCase) {
        seen.set(lowerOption, option);
      }
    });

    return Array.from(seen.values());
  };

  const filteredOptions = getUniqueOptions(
    options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const { language } = useContext(LanguageContext);
  const texts = findABoutiqueListingStaticData[language]
  


  return (
    <div className={styles.container}>
      {hasSearch && (
        <div className={styles.searchBar}>
          <SearchIcon fill="#" className={styles.searchIcon} />
          <input
            type="text"
            placeholder={`Search for ${title.toLowerCase()}`}
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      )}
      <div className={styles.checkboxGroup}>
        {filteredOptions
          .slice(0, showAll ? filteredOptions.length : 10)
          .map((option) => (
            <label key={option} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.some(selected => selected.toLowerCase() === option.toLowerCase())}
                onChange={handleOptionChange}
                className={styles.checkboxInput}
              />
              <div className={styles.customCheckbox}>
                <div className={styles.checkboxTickbox}>
                  <Tickbox />
                </div>
                {selectedOptions.some(selected => selected.toLowerCase() === option.toLowerCase()) && (
                  <div className={styles.tickIcon}>
                    <Tick />
                  </div>
                )}
              </div>
              <Typography
                align="left"
                variant="p"
                className={styles.checkboxTitle}
              >
                {option}
              </Typography>
            </label>
          ))}
        {filteredOptions.length > 10 && (
          <div className={styles.viewMoreButton}>
            <button onClick={handleViewMore}>
              {showAll ? texts?.viewLess : texts?.viewMore}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxFilter;
