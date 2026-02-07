import React from "react";
import BrandCategoryContent from "../brandCategoryContent";

const WatchesContent = () => {
  return (
    <BrandCategoryContent 
      categoryType="watches" 
      title="Top Suggestions" 
      suggestionsKey="watchSuggestions" 
    />
  );
};

export default React.memo(WatchesContent);