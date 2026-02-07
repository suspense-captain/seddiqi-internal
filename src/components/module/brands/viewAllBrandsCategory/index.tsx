import TabbedNavigation from "@components/module/tabbedNavigation";
import { LanguageContext } from "@contexts/languageContext";
import { allBrandsStaticData } from "@utils/data/english-arabic-static-data";
import React, { useContext } from "react";
import styles from "./viewAllBrandsCategory.module.scss";

const ViewAllBrandsCategory = ({ ...content }) => {
  const { language } = useContext(LanguageContext);
  const staticText = allBrandsStaticData[language];

  return (
      <TabbedNavigation
        tabs={[
          { id: 1, title: staticText },
          // { id: 2, title: "watches" },
          // { id: 3, title: "Jewellery" },
          // { id: 4, title: "accessories" },
        ]}
        className={styles.tabContainer}
      />
  );
};

export default ViewAllBrandsCategory;
