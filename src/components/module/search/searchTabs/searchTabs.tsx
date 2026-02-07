import React from "react";
import styles from "./searchTabs.module.scss";
import Typography from "../../typography";

const SearchTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className={`${styles.tabs} ${styles.tabsContainer}`}>
      {["Watches", "Stories"].map((tab) => (
        <div
          key={tab}
          className={`${styles.tab} ${
            activeTab === tab.toLowerCase() ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tab.toLowerCase())} 
        >
          <Typography variant="h5" className={`${tab.toLowerCase()}Tab`}>
            {tab.toUpperCase()}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default SearchTabs;
