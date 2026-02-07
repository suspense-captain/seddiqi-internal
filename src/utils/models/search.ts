export interface SearchProps {
    content?:[];

  }
  
export interface NoResultsProps {
    message?: string;
  }
  
  export interface SearchContextType  {
    inputSearchTerm: string;
    setInputSearchTerm: (term: string) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    popularBrands: string[];
    popularSearches: string[];
    productSuggestions: any[];
    recommendationResults: any[];
    categoriesResults: string[]; 
    noResults: boolean;
    categorySuggestions: any[];
    storiesResults: any[]; 
    setStoriesResults: (stories: any[]) => void; 
    productResults: any[]; 
    setProductResults: (products: any[]) => void;
    openSearch: () => void;
    closeSearch: () => void;
    isError: boolean;
    isLoading: boolean;
    isSearchOpen: boolean;
    isSearchResultLoading: boolean;
  } 