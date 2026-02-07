import { SizeGuideSelectorContextProps } from "@utils/models/sizeGuideSelector";
import React, { createContext, useContext } from "react";

export const SizeGuideProviderContext = createContext<SizeGuideSelectorContextProps | undefined>(undefined);

export const useSizeGuideProviderContext = () => {
  const context = useContext(SizeGuideProviderContext);
  if (!context) {
    throw new Error("useSizeGuideProviderContext must be used within a SizeGuideProvider");
  }
  return context;
};

export const SizeGuideProvider = ({ children, sizeGuideData }) => {
  const value = {
    sizeGuideData,
  };

  return (
    <SizeGuideProviderContext.Provider value={value}>
      {children}
    </SizeGuideProviderContext.Provider>
  );
};
