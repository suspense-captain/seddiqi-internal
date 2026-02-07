import React, { useState, useEffect } from "react";
import styles from "./search.module.scss";
import Typography from "../typography";
import RichText from "../richText";
import { Button } from "@components/module";
import { SearchIcon } from "@assets/images/svg";
import { CloseIconV2 } from "@assets/images/svg";
import ProductCard from "../cards/productCard";
import { SearchProps } from "@utils/models/search";
import {
  PopularProducts,
  SearchTabs,
  RecommendedSearches,
  StoriesResults,
  NoSearchResultFound,
} from "@components/module";
import { useSearchContext } from "@contexts/searchContext";
import { ACTIVE_TABS } from "@contexts/searchContext";

const Search = ({ closeSearch }) => {
  const {
    inputSearchTerm,
    setInputSearchTerm,
    activeTab,
    setActiveTab,
    popularBrands,
    popularSearches,
    productSuggestions,
    recommendationResults,
    categoriesResults,
    storiesResults,
    noResults,
    categorySuggestions,
    isLoading,
    isSearchOpen,
    isSearchResultLoading,
  } = useSearchContext();

  useEffect(() => {
    if (isSearchOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBarWrapper}>
        <SearchIcon fill="#" className={styles.searchIcon} />
        <input
          type="text"
          placeholder={`Search ${activeTab}`}
          value={inputSearchTerm}
          className={styles.searchInput}
          onChange={(e) => setInputSearchTerm(e.target.value)}
        />
        <div onClick={closeSearch} className={styles.closeIcon}>
          <CloseIconV2 className={styles.closeIcon} />
        </div>
      </div>

      {inputSearchTerm && !isLoading && (
        <div className={styles.autocompleteSuggestions}>
          {categorySuggestions.map((suggestion, index) => (
            <div key={index} className={styles.suggestionItem}>
              {suggestion}
            </div>
          ))}
        </div>
      )}

      <div className={styles.searchContentWrapper}>
        <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {inputSearchTerm && activeTab === ACTIVE_TABS.WATCHES ? (
          <>
            {
              noResults ? 
              <NoSearchResultFound message={inputSearchTerm} /> :
              <RecommendedSearches
                categoryDetails={categoriesResults}
                productRecommendation={recommendationResults}
                searchTerm={inputSearchTerm}
                isLoading={isSearchResultLoading}
              />
            }
          </>
        ) : (
          <>
            {activeTab === ACTIVE_TABS.STORIES && 
              <div className={styles.storiesWrapper}>
                <StoriesResults storiesResults={storiesResults} />
              </div>
            }
            {activeTab === ACTIVE_TABS.WATCHES && 
              <PopularProducts
                popularBrands={popularBrands}
                popularSearches={popularSearches}
                productSuggestions={productSuggestions}
              />
            }
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
