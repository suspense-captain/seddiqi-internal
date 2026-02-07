import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./filterBar.module.scss";
import FilterBtn from "../filterBtn";
import SideDrawer from "../sideDrawer";
import PriceRangeFilter from "../allFilters/priceRangeFilter";
import SortFilter from "../allFilters/sortFilter";
import { FilterAccordian, FilterAccordionItem } from "../filterAccordian";
import CheckboxFilter from "../checkboxFilter";
import ColorFilter from "../allFilters/colorFilter";
import Typography from "../typography";
import { CloseIcon } from "@assets/images/svg";
import { getCategoryFilters } from "@utils/sfcc-connector/dataService";
import Loader from "../loader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterObjectRemoveEmptyKey, removeEmptyObjectsByKeys } from "@utils/helpers/removeEmptyObject";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { LanguageContext } from "@contexts/languageContext";
import { plpContentTexts } from "@utils/data/english-arabic-static-data";


const FilterBar = ({
  filters: initialFilters,
  onFilterChange,
  totalProducts,
  categoryId,
  setFilterOptions,
  filterOptions = [],
  resetProducts,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [filters, setFiltersState] = useState(initialFilters || {});
  const [sortingOptions, setSortingOptions] = useState([]);
  const [quickFilters, setQuickFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useDeviceWidth();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const router = useRouter();

  useEffect(() => {
    if (isInitialMount.current) {
      const params = Object.fromEntries(searchParams.entries());
      const urlFilters = Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = value.includes(',') ? value.split(',') : [value];
        return acc;
      }, {});

      const mergedFilters = { ...urlFilters, ...initialFilters };
      setFiltersState(mergedFilters);
      isInitialMount.current = false;
    }
  }, [initialFilters, searchParams]);

  useEffect(() => {
    const fetchCategoryFilters = async () => {
      try {
        const response = await getCategoryFilters({
          method: "GET",
          cgid: categoryId,
        });

        // console.log("response-------", response);

        if (response && response.refinements) {
          setFilterOptions(response.refinements);
        }

        // if (response && response.sortingOptions) {
        //   setSortingOptions(response.sortingOptions);
        // }
        setIsLoading(false);
        // if (response && response.quickFilters) {
        //   setQuickFilters(response.quickFilters);
        // }
      } catch (error) {
        console.error("FilterBar (PLP) error-", error);
        setIsLoading(false);
        router.push("/500")
      }
    };

    fetchCategoryFilters();
  }, [categoryId]);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleOptionChange = (filterKey, option) => {
    setFiltersState((prevFilters) => {
      const prevSelectedOptions = prevFilters[filterKey] || [];
      const optionExists = prevSelectedOptions.some(
        (selected) => selected.toLowerCase() === option.toLowerCase()
      );
      
      const newSelectedOptions = optionExists
        ? prevSelectedOptions.filter((selected) => selected.toLowerCase() !== option.toLowerCase())
        : [...prevSelectedOptions, option];

      const updatedData = newSelectedOptions.length > 0
        ? { ...prevFilters, [filterKey]: newSelectedOptions }
        : Object.fromEntries(
            Object.entries(prevFilters).filter(([key]) => key !== filterKey)
          );

      onFilterChange(updatedData);
      return updatedData;
    });
  };

  const handleSortChange = (selectedSortOption) => {
    setFiltersState((prevFilters) => ({
      ...prevFilters,
      sortOption: selectedSortOption,
    }));
  };

  const handleDelete = (filterKey, option) => {
    setFiltersState((prevFilters) => {
      if (filterKey === "sortOption") {
        const { sortOption, ...rest } = prevFilters;
        onFilterChange(rest);
        return rest;
      }

      const prevSelectedOptions = prevFilters[filterKey] || [];
      const newSelectedOptions = prevSelectedOptions.filter(
        (selected) => selected !== option
      );

      const updatedData = newSelectedOptions.length > 0
        ? { ...prevFilters, [filterKey]: newSelectedOptions }
        : Object.fromEntries(
            Object.entries(prevFilters).filter(([key]) => key !== filterKey)
          );

      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      if (newSelectedOptions.length > 0) {
        params.set(filterKey, newSelectedOptions.join(','));
      } else {
        params.delete(filterKey);
      }
      replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);

      onFilterChange(updatedData);
      return updatedData;
    });
  };

  const handleClearAll = () => {
    setFiltersState({});
    replace(pathname);
    resetProducts(24, true);
    setDrawerOpen(false);
  };

  const handleClearCheckboxes = (filterKey) => {
    setFiltersState((prevFilters) => {
      if (filterKey === "sortOption") {
        const { sortOption, ...rest } = prevFilters;
        onFilterChange(rest);
        return rest;
      }

      const updatedData = Object.fromEntries(
        Object.entries(prevFilters).filter(([key]) => key !== filterKey)
      );
      
      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete(filterKey);
      replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);

      onFilterChange(updatedData);
      return updatedData;
    });
  };

  const totalSelectedCount = initialFilters
    ? Object.values(initialFilters).reduce((acc: number, curr: unknown) => {
        return acc + (Array.isArray(curr) ? curr.length : 0);
      }, 0)
    : 0;

  const toggleAccordion = (key) => {
    setOpenAccordionId((prev) => (prev === key ? null : key));
  };

  const { language } = useContext(LanguageContext); 

  return (
    <div className={styles.container}>
      <div className={styles.filterBtns}>
        <FilterBtn label={plpContentTexts[language]?.allFilters} icon={true} onClick={toggleDrawer} />
        {/* {quickFilters &&
          quickFilters.length > 0 &&
          quickFilters.map((item, index) => (
            <FilterBtn
              key={index}
              label={item.label}
              icon={false}
              onClick={undefined}
            />
          ))} */}
      </div>
      <div className={styles.sortSection}>
        {/* {sortingOptions && sortingOptions.length > 0 && (
          <SortFilter
            sortingOptions={sortingOptions}
            selectedSortOption={filters.sortOption}
            onSortChange={handleSortChange}
          />
        )} */}

        <div className={styles.productsLength}>{plpContentTexts[language]?.productsText(totalProducts)}</div>
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={null}
        onClearAll={handleClearAll}
        showFooter={true}
        showBackButton={false}
        position={""}
        className={""}
        button2Color={"metallic"}
      >
        {Object && Object.keys(filters) && Object.keys(filters).length > 0 && (
          <div className={styles.selectedOptions}>
            {Object.keys(filters).map((filterKey) =>
              Array.isArray(filters[filterKey])
                ? filters[filterKey].map((option, index) => (
                    <div key={index} className={styles.selectedOption}>
                      <Typography
                        align="left"
                        variant="p"
                        className={styles.option}
                      >
                        {option}
                      </Typography>
                      <div
                        className={styles.deleteOption}
                        onClick={() => handleDelete(filterKey, option)}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  ))
                : null
            )}
          </div>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          <FilterAccordian>
            {filterOptions.map((filterItem) => {
              const showYearFilterOnlyOnCpo = filterItem.label.toLowerCase() === 'year' && categoryId !== 'rolex-cpo'.toLowerCase();

              if (showYearFilterOnlyOnCpo) {
                return null;
              }

              return (
                <FilterAccordionItem
                  key={filterItem.attributeId}
                  title={filterItem.label}
                  isOpen={openAccordionId === filterItem.attributeId}
                  onToggle={() => toggleAccordion(filterItem.attributeId)}
                  onClear={() => handleClearCheckboxes(filterItem.attributeId)}
                  selectedCount={filters[filterItem.attributeId]?.length || 0}
                >
                  {filterItem.values &&
                    !filterItem.attributeId.includes("color") &&
                    !filterItem.attributeId.includes("price") && (
                      <CheckboxFilter
                        title={filterItem.label}
                        options={filterItem.values
                          .filter((val) => val.hitCount > 0)
                          .map((val) => val.label)}
                        filterKey={filterItem.attributeId}
                        onOptionChange={handleOptionChange}
                        selectedOptions={filters[filterItem.attributeId] || []}
                        hasSearch={filterItem.attributeId.includes("brand")}
                      />
                    )}

                  {/* {filterItem.attributeId.includes("price") && (
                  <PriceRangeFilter priceData={filterItem.values} />
                )} */}
                  {filterItem.attributeId.includes("color") && <ColorFilter />}
                </FilterAccordionItem>
              );
            })}
          </FilterAccordian>
        )}
      </SideDrawer>
    </div>
  );
};

export default FilterBar;
