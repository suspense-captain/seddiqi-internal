import React, { useContext, useState } from "react";
import styles from "./searchPopUp.module.scss";
import { CloseIconV2, SeddiqiLogoBlack } from "@assets/images/svg";
import Link from "next/link";
import { LanguageContext } from "@contexts/languageContext";
import { introAndExplore } from "@utils/data/english-arabic-static-data";

const SearchPopUp = ({ content, setSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = content?.filter((item) => {
    return item?.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const { language } = useContext(LanguageContext)


  return (
    <div className={styles.container}>
      <div onClick={() => setSearchOpen(false)} className={styles.closeIcon}>
        <CloseIconV2 />
      </div>
      <div className={styles.textContainer}>
        <div onClick={() => setSearchOpen(true)} className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={introAndExplore[language]?.searchText}
            className={styles.input}
          />
          {/* <button className={styles.iconButton}>
            <span className={styles.icon}></span>
          </button> */}
          <div className={styles.seddiqiLogo}>
            <SeddiqiLogoBlack />
          </div>
        </div>
      </div>

      <div className={styles.legacyContainer}>
        <ul className={styles.legacyList}>
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <li key={item?.url}>
                <Link onClick={() => setSearchOpen(false)} href={item?.url}>
                  {item?.title}
                </Link>
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchPopUp;
