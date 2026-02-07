import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SearchContextType } from "@utils/models/search";
import {
  getSearchResults,
  getContentSearch,
  getSearchSuggestions,
  getProducts,
} from "@utils/sfcc-connector/dataService";
import debounce from "lodash/debounce";

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("SearchContext must be used within the SearchProvider");
  }
  return context;
};

export const ACTIVE_TABS = {
  WATCHES: "watches",
  STORIES: "stories"
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    inputSearchTerm: "",
    activeTab: ACTIVE_TABS.WATCHES,
    popularBrands: [],
    popularSearches: [],
    productSuggestions: [],
    recommendedProductSuggestions: [],
    recommendationResults: [],
    categoriesResults: [],
    storiesResults: [],
    noResults: false,
    categorySuggestions: [],
    productResults: [],
    isSearchOpen: false,
    isError: false,
    isLoading: false,
    isSearchResultLoading: false
  });

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));

  const fetchSearchResults = async (searchTerm: string) => {
    updateState({ isSearchResultLoading: true });

    try {
      const response = await getSearchResults({ 
        method: "GET", 
        query: searchTerm || state.inputSearchTerm, 
        categoryId: state.activeTab,
        limit: "6",
      });

      if (response.response?.hits) {
        const topSixProductIds = response.response.hits.map((product) => product.productId);
        const productDetails = await getProducts({ method: "GET", pids: topSixProductIds });

        const recommendedSearchResults = await getSearchSuggestions({ method: "GET", query: searchTerm });

        const categoryNamesRecommendations = recommendedSearchResults.
          response?.
          categorySuggestions?.
          categories?.
          map((category) => category.name) || [];

        updateState({ 
          recommendationResults: productDetails.data,
          categoriesResults: categoryNamesRecommendations,
          noResults: false,
        });
      } else {
        updateState({ noResults: true })
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      updateState({ isSearchResultLoading: false });
    }
  };

  const fetchStoriesResults = async () => {
    try {
      const response = await getContentSearch({ method: "POST", query: state.activeTab });
      updateState({ storiesResults: response.response?.flatMap(story => story.content?.listItems || []) || [] });
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await getSearchSuggestions({ method: "GET", query: state.activeTab });
      const suggestedTerms = response?.response?.customSuggestions?.suggestedTerms?.map(
        (termObj) => termObj.originalTerm
      ) || [];
  
      updateState({ popularSearches: suggestedTerms });
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  const fetchPopularProductsAndBrands = async () => {
    try {
      const response = await getSearchResults({ 
        method: "GET", 
        query: state.inputSearchTerm, 
        categoryId: state.activeTab,
        limit: "3",
      });

      const brandRefinement = response.
        response?.
        refinements?.
        find((refinement) => refinement.attributeId === "c_brandName");
      
      if (brandRefinement) {
        const popularBrands = brandRefinement.values
          .filter((value) => value.hitCount >= 0)
          .sort((a, b) => b.hitCount - a.hitCount)
          .slice(0, 4)
          .map((value) => value.value);

        updateState({ popularBrands });
      }
      if (response.response?.hits) {
        const topProductIds = response.response.hits.slice(0, 3).map((product) => product.productId);
        const productDetails = await getProducts({ method: "GET", pids: topProductIds });
        updateState({ productSuggestions: productDetails })
      }
    } catch (error) {
      console.error("Error fetching brand and product suggestions:", error);
    }
  };

  const fetchInitialData = (activeTab: string) => {
    switch (activeTab) {
      case ACTIVE_TABS.WATCHES:
        const searchesNotFetched = state.popularSearches.length === 0;
        
        if (searchesNotFetched) {
          fetchPopularSearches();
        }

        const productAndBrandsNotFetched = state.popularBrands.length === 0 && state.productSuggestions.length === 0;

        if (productAndBrandsNotFetched) {
          fetchPopularProductsAndBrands();
        }
        break;
      case ACTIVE_TABS.STORIES:
        const storiesNotFetched = state.storiesResults.length === 0;

        if (storiesNotFetched) {
          fetchStoriesResults();
        }
        break;
      default:
        break;
    }
  };

  const openSearch = () => {
    updateState({ isSearchOpen: true });
  };

  const closeSearch = () => updateState({ 
    isSearchOpen: false, 
    inputSearchTerm: "", 
    recommendationResults: [],
    categoriesResults: [],
  });
  
  const makeDebouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      fetchSearchResults(searchTerm);
    }, 500),
    []
  );

  useEffect(() => {
    if (state.isSearchOpen) {
      fetchInitialData(state.activeTab);
    }
  }, [state.activeTab, state.isSearchOpen]);

  useEffect(() => {
    if (state.inputSearchTerm) {
      updateState({ noResults: false });
      makeDebouncedSearch(state.inputSearchTerm, state.activeTab);
    }
  }, [state.inputSearchTerm]);

  const value: SearchContextType = {
    ...state,
    setInputSearchTerm: (term: string) => updateState({ inputSearchTerm: term }),
    setActiveTab: (tab: string) => updateState({ activeTab: tab }),
    setStoriesResults: (results: any[]) => updateState({ storiesResults: results }),
    setProductResults: (results: any[]) => updateState({ productResults: results }),
    openSearch,
    closeSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
