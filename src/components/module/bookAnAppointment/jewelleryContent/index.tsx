import React from "react";
import BrandCategoryContent from "../brandCategoryContent";

const JewelleryContent = () => {
  return (
    <BrandCategoryContent 
      categoryType="jewellery" 
      title="Top Suggestions" 
      suggestionsKey="jewellerySuggestions" 
    />
  );
};

export default React.memo(JewelleryContent);