import React, { useRef, useState, useEffect } from "react";
import styles from "./tabbedNavigation.module.scss";
import { generateUniqueId } from "@utils/helpers/uniqueId";

interface Tab {
  id: number;
  title: string;
  content?: React.ReactNode;
}

interface TabbedNavigationProps {
  tabs: Tab[];
  className?: string;
  gap?: number;
  hideTabs?: boolean;
  scrollToCenterOnMobile?: boolean; // Optional prop to enable scroll on mobile
}

const TabbedNavigation: React.FC<TabbedNavigationProps> = ({
  tabs,
  className,
  gap,
  hideTabs,
  scrollToCenterOnMobile,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabListRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToTab = (index: number) => {
    const tab = tabRefs.current[index];
    const container = tabListRef.current;

    if (!tab || !container) return;

    const tabLeft = tab.offsetLeft;
    const tabWidth = tab.offsetWidth;
    const containerWidth = container.clientWidth;

    // Scroll to center the clicked tab
    const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.tabsContainer}>
      {tabs?.length > 0 && !(tabs.length === 1 && !tabs[0]?.title) && (
        <div className={`${className} ${hideTabs ? styles.hide : ""}`}>
          <div className={`${scrollToCenterOnMobile && styles.tabsExtra} ${styles.tabs}`} style={{ gap }} ref={tabListRef}>
            {tabs.map((tab, index) => {
              if (!tab?.title) return null;

              return (
                <div
                  key={generateUniqueId()}
                  ref={(el) => (tabRefs.current[index] = el)}
                  className={`${styles.tab} ${
                    tab.id === activeTab ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (scrollToCenterOnMobile && isMobile) {
                      scrollToTab(index);
                    }
                  }}
                >
                  {tab.title}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tabs.find((tab) => tab.id === activeTab)?.content}
    </div>
  );
};

export default TabbedNavigation;
