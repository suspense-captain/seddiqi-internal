import React, { useContext } from "react";
import styles from "./megaMenu.module.scss";
import { HeaderContext } from "@contexts/headerContext";
import { HeaderFooter, SubMenuLinks, NavCardBlocks } from "@components/module";
import { LanguageContext } from "@contexts/languageContext";

const MegaMenu = ({ headerHeightClass }) => {
  const headerContext = useContext(HeaderContext);
  const { current, headerData } = headerContext;
  const { language } = useContext(LanguageContext);

  const isKsa = language.includes("-SA")
  
  if (current === null) return null;
  const currentHeaderData = headerData?.children[current];
  // if (
  //   Array.isArray(currentHeaderData?.children) &&
  //   !currentHeaderData?.content?.contentBlock 
  // ) {
  //   return null;
  // }
  if (
    currentHeaderData?.children?.length <= 0 
  ) {
    return null;
  }
  return (
    <section className={`${headerHeightClass} ${styles.megaMenuContainer}`}>
      <div className={styles.columns}>
        <SubMenuLinks />
        {!isKsa && <NavCardBlocks />}
        
      </div>
      <HeaderFooter className={styles.headerFooter} />
    </section>
  );
};

export default MegaMenu;
