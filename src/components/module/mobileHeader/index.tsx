import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./mobileHeader.module.scss";

import TabbedNavigation from "../tabbedNavigation";
import MobileHeaderNavbar from "../mobileHeaderNavbar";
import { HeaderContext } from "@contexts/headerContext";
import TabContentProducts from "../tabContent/tabContentProducts";
import TabContentExplore from "../tabContent/tabContentExplore";
import { LanguageContext } from "@contexts/languageContext";
import NewsletterSignup from "../newsletterSignup";
import LanguageSelector from "../languageSelector";

const MobileHeader = () => {
  // const [menuOpen, setMenuOpen] = useState(false);
  const { headerRef, headerData, menuOpen, setMenuOpen } = useContext(HeaderContext);
  const { language } = useContext(LanguageContext);
  // const headerRef = useRef<any | null>(null);

  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [language]);


  if (!headerData) return null;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const containerCss: React.CSSProperties = {
    height: menuOpen ? "100vh" : "80px",
    overflowY: menuOpen ? "scroll" : "hidden",
  };

  const contentComponents = [<TabContentProducts />, <TabContentExplore />];
  let tabs = [];
  headerData?.children?.forEach((tab, ind) => {
    let obj = {
      id: ind + 1,
      title: tab?.content?.type,
      tab,
    };

    if (language?.includes("ar-")) {
      if (tab?.content?.type === "Explore") {
        obj.title = "اكتشف";
      } else if (tab?.content?.type === "Products") {
        obj.title = "منتجات";
      }
    }


    if (!tabs.some((existingTab) => existingTab.id === obj.id || existingTab.title === obj.title)) {
      tabs.push(obj);
    }
  });

  tabs = tabs.map((tab, ind) => {
    return { ...tab, content: contentComponents[ind] || null };
  });

  useEffect(() => {
    if (!menuOpen && headerRef.current) {
      // Scroll the mobileHeader element to the top
      headerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [menuOpen]);


  return (
    <div ref={headerRef}  style={containerCss} className={styles.position} id="mobile-header">
      <MobileHeaderNavbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
      {menuOpen &&  <TabbedNavigation className={styles.tabNavigation} tabs={tabs} />}
    </div>
  );
};

export default MobileHeader;
