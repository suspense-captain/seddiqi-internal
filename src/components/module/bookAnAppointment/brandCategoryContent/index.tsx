import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./brandCategoryContent.module.scss";
import { getCategory } from "@utils/sfcc-connector/dataService";
import { Tick } from "@assets/images/svg";
import { Button } from "@components/module";
import { useBookAppointmentContext } from "@contexts/bookAppointmentContext";
import BookAnAppointmentBrandSearch from "@components/rendering/bookAnAppointmentBrandSearch";

// temp
const brands = {
  A: ["Akrivia", "Aramedes", "Artya", "Audemars Piguet"],
  B: ["Bell & Ross", "Bernard Favre", "Bovet", "Breitling", "Bvlgari"],
  C: ["Cabestan", "Chopard", "Christian Van der Klaauw", "Christophe Claret", "Claude Meylan"],
  D: ["Debethune", "Dior"],
  E: ["Emmanuel Bouchet"],
  F: ["F.p. Journe", "Ferdinand Berthoud", "Frederique Constant"],
};

const BrandCategoryContent = ({ categoryType, title, suggestionsKey }) => {
  const [showAlphabetical, setShowAlphabetical] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState(null);
  const [allBrands, setAllBrands] = useState(null);
  const { 
      selectedJewellery, 
      setSelectedJewellery, 
      selectedWatches, 
      setSelectedWatches, 
      handleStepChange, 
      updateStep,
      isPreviousStepEdited,
      setIsPreviousStepEdited,
      stepsContent,
      handleCheckboxChange
  } = useBookAppointmentContext();

  const fetchSuggestions = async (cateType?: string) => {
    const response = await getCategory({ cgid: cateType ? cateType : categoryType, method: "GET" });
    //console.log("response", response)
    if (cateType) {
      setAllBrands(response?.response?.categories);
    } else {
      setCategorySuggestions(response?.response?.categories);
    }
    localStorage.setItem(suggestionsKey, JSON.stringify(response?.response?.categories));
  };

  useEffect(() => {
    const cachedSuggestions = localStorage.getItem(suggestionsKey);
    if (cachedSuggestions) {
      setCategorySuggestions(JSON.parse(cachedSuggestions));
    } else {
      fetchSuggestions();
      fetchSuggestions("seddiqi-storefront-catalog");
    }
  }, [suggestionsKey]);

  // Don't delete yet. Might use this on a later date
  // const handleCheckboxChange = useCallback(
  //   (itemName) => {
  //     if (categoryType === "jewellery") {
  //       const isSelected = selectedJewellery.includes(itemName);
  //       const updatedJewellery = isSelected
  //         ? selectedJewellery.filter((item) => item !== itemName)
  //         : [...selectedJewellery, itemName];

  //       if (updatedJewellery.length !== selectedJewellery.length) {
  //         setSelectedJewellery(updatedJewellery);
  //         localStorage.setItem("selectedJewellery", JSON.stringify(updatedJewellery));
  //       }
  //     } else {
  //       // categoryType === "watches"
  //       const isSelected = selectedWatches.includes(itemName);
  //       const updatedWatches = isSelected
  //         ? selectedWatches.filter((item) => item !== itemName)
  //         : [...selectedWatches, itemName];

  //       if (updatedWatches.length !== selectedWatches.length) {
  //         setSelectedWatches(updatedWatches);
  //         localStorage.setItem("selectedWatches", JSON.stringify(updatedWatches));
  //       }
  //     }
  //   },
  //   [selectedWatches, selectedJewellery, setSelectedWatches, setSelectedJewellery, categoryType]
  // );

  const memoizedSuggestions = useMemo(() => categorySuggestions, [categorySuggestions]);

  if (!categorySuggestions) {
    return null;
  }

  return (
    <>
      <div className={styles.suggestionContainer}>
        <div className={styles.suggestionTitle}>{title}</div>
        <div className={styles.suggestionItems}>
          {memoizedSuggestions?.map((item) => (
            <div className={styles.brandItem} key={item?.name}>
              <label htmlFor={`checkbox-${item?.name}`} className={styles.checkboxLabel}>
                {categoryType === "jewellery" ? (
                  <input
                    className={styles.inputCheckbox}
                    type="checkbox"
                    id={`checkbox-${item?.name}`}
                    checked={selectedJewellery.includes(item?.name)}
                    onChange={() => handleCheckboxChange(item?.name, categoryType)}
                    disabled={selectedWatches?.length > 0}
                  />
                ) : (
                  <input
                    className={styles.inputCheckbox}
                    type="checkbox"
                    id={`checkbox-${item?.name}`}
                    checked={selectedWatches.includes(item?.name)}
                    onChange={() => handleCheckboxChange(item?.name, categoryType)}
                    disabled={selectedJewellery?.length > 0}
                  />
                )}
                <div className={styles.checkbox}>
                  <Tick className={styles.tick} />
                </div>
                <span className={styles.brandName}>{item?.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <BookAnAppointmentBrandSearch cta={null} categoryType={categoryType} />
      
      <div className={styles.stepButtonsContainer}>
        <div className={styles.selectBrandBtn}>
          <Button
            clickHandler={() => {
              handleStepChange(3);
              updateStep(2, true);
              setIsPreviousStepEdited(false);
            }}
            isLink={false}
            title={isPreviousStepEdited ? stepsContent.other.returnButtonText : stepsContent.second.buttonText }
            type={selectedWatches?.length > 0 ? "transparent" : "disabled"}
            color={selectedWatches?.length > 0 ? "green_dark" : "grey_light"}
          />
        </div>

        <div className={`${styles.skipBrandBtn} ${selectedWatches?.length > 0 ? styles.disabled : ""}`}>
          <Button
            clickHandler={() => {
              handleStepChange(3);
              updateStep(2, true);
              setIsPreviousStepEdited(false);
            }}
            isLink={false}
            title={"Skip To Next Step"}
            type={"plain"}
            color={"black_dark"}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(BrandCategoryContent);
