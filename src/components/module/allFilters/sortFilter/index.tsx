import React, { useState } from "react";
import styles from "../allFilters.module.scss";
import Typography from "@components/module/typography";
import { ArrowDown, Ellipse } from "@assets/images/svg";
import classNames from "classnames";
import { useDeviceWidth } from "@utils/useCustomHooks";

const SortFilter = ({ sortingOptions, selectedSortOption, onSortChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [getValue, setValue] = useState("Sort By");
  const isDesktop = useDeviceWidth();

  const handleOptionChange = (event, ind) => {
    // console.log({event});
    
    setValue(sortingOptions[ind].label)
    onSortChange(event.target.value);
  };

  return (
    // <div className={styles.container}>
    //   <div className={styles.customSelect}>
    //     <div className={styles.radioGroup}>
    //       <select onChange={(e) => handleOptionChange?.(e)} value={"Sort"}>
    //         <option value={null}>
    //           <Typography align="left" variant="p" className={styles.title}>
    //             Sort by
    //           </Typography>
    //         </option>
    //         {sortingOptions.map((option) => (
    //           <option key={option.id} value={option.id}>
    //             <label className={styles.radioLabel}>
    //               <input
    //                 type="radio"
    //                 value={option.id}
    //                 checked={selectedSortOption === option.id}
    //                 onChange={handleOptionChange}
    //                 className={styles.radioInput}
    //               />
    //               <div className={styles.customRadio}>
    //                 <Ellipse className={styles.radioEllipse} />
    //                 <div className={styles.radioDot} />
    //               </div>
    //               <Typography align="left" variant="p" className={styles.title}>
    //                 {option.label}
    //               </Typography>
    //             </label>
    //           </option>
    //         ))}
    //       </select>
    //     </div>
    //     <ArrowDown className={styles.arrow} />
    //   </div>

    // </div>

    <div className={styles.customSelect}>
      <button
        className={styles.selectButton}
        role="combobox"
        aria-label="select button"
        aria-haspopup="listbox"
        aria-expanded={isActive}
        aria-controls="select-dropdown"
        onClick={() => setIsActive((prev) => !prev)}
      >
      <span className="selectedValue">{getValue}</span>
      <ArrowDown className={classNames(styles.arrow, isActive && styles.active)} />
      </button>

      <ul role="listbox" id="select-dropdown" className={classNames(styles.radioList, isActive && styles.active)}>
        {sortingOptions.map((option, ind) => (
          <li key={option.id} value={option.id}  onChange={(e) => handleOptionChange(e, ind)}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value={option.id}
                checked={selectedSortOption === option.id}
                className={styles.radioInput}
              />
              <div className={styles.customRadio}>
                <Ellipse className={styles.radioEllipse} />
                <div className={styles.radioDot} />
              </div>
              <Typography align="left" variant="p" className={styles.title}>
                {option.label}
              </Typography>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortFilter;
