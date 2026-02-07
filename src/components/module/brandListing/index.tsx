import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./brandListing.module.scss";
import Button from "../button";
import Link from "next/link";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { SearchIcon } from "@assets/images/svg";
import { useContext } from "react";
import { LanguageContext } from "@contexts/languageContext";

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const BrandListing = ({ height = true, categories, brandPages = [], haveScrollbars, ...content }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const alphabetData = {
    en: {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      g: 'g',
      h: 'h',
      i: 'i',
      j: 'j',
      k: 'k',
      l: 'l',
      m: 'm',
      n: 'n',
      o: 'o',
      p: 'p',
      q: 'q',
      r: 'r',
      s: 's',
      t: 't',
      u: 'u',
      v: 'v',
      w: 'w',
      x: 'x',
      y: 'y',
      z: 'z'
    },
    ar: {
      a: 'أ',
      b: 'ب',
      c: 'ت',
      d: 'ث',
      e: 'ج',
      f: 'ح',
      g: 'خ',
      h: 'د',
      i: 'ذ',
      j: 'ر',
      k: 'ز',
      l: 'س',
      m: 'ش',
      n: 'ص',
      o: 'ض',
      p: 'ط',
      q: 'ظ',
      r: 'ع',
      s: 'غ',
      t: 'ف',
      u: 'ق',
      v: 'ك',
      w: 'ل',
      x: 'م',
      y: 'ن',
      z: 'ه',
      aa: 'و',
      bb: 'ي'
    }
  };
  
  const { country, handleLanguageChange, language } = useContext(LanguageContext);
  const [brands, setBrands] = useState(categories);
  const alphabetNavRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const brandListRef = useRef(null);
  const swiperRef = useRef(null);
  const isDesktop = useDeviceWidth();

  // useEffect(() => {
  //   if (handleLanguageChange && language !== "ar-AE") {
  //     handleLanguageChange("ar-AE");
  //   }
  // }, []);

  // Handle the letter click to scroll the brand list
  const handleLetterClick = (letter) => {
    const section = document.getElementById(`section-${letter}`);

    if (section && brandListRef.current) {
      if (isDesktop[0]) {

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

      } else {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }

      if(haveScrollbars === true){      
        window.scrollBy(0, 0);
      }
    }
  };

  const enabledAlphabets = useMemo(() => {
    const enabled = [];
    brands?.forEach((brand) => {
      const firstLetter = brand.name[0]?.toLowerCase();
      if (firstLetter && !enabled.includes(firstLetter)) {
        enabled.push(firstLetter);
      }
    });
    return enabled.sort();
  }, [brands]);

  // Handle input change for search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightText = (text, search) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <span key={index} className={styles.highlightedLetters}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Filter brands based on the search term
  const filteredBrands = useMemo(() => {
    if (!searchTerm) return brands;
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  useEffect(() => {
    // Update Swiper when filteredBrands changes (e.g., after a search term update)
    if (swiperRef.current) {
      swiperRef.current.swiper.update(); // This will update the scrollbar size
    }
  }, [filteredBrands]);
  
  //  scroll functionality
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX || e.touches[0].pageX;
    scrollLeftRef.current = alphabetNavRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    // The multiplier affects scroll speed
    const walk = (x - startXRef.current) * 2;
    alphabetNavRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Add touch event listeners for mobile devices
  useEffect(() => {
    const nav = alphabetNavRef.current;
    if (nav) {
      nav.addEventListener("touchstart", handleMouseDown, { passive: true });
      nav.addEventListener("touchmove", handleMouseMove, { passive: true });
      nav.addEventListener("touchend", handleMouseUpOrLeave);
      return () => {
        nav.removeEventListener("touchstart", handleMouseDown);
        nav.removeEventListener("touchmove", handleMouseMove);
        nav.removeEventListener("touchend", handleMouseUpOrLeave);
      };
    }
  }, []);

  useEffect(() => {
    setBrands(categories);
  }, [brands]);

  // Only render the section if there's at least one brand with a matching letter
  const renderBrandSection = (letter) => {
    const brandsForLetter = filteredBrands.filter((brand) =>
      brand.name.toLowerCase().startsWith(letter)
    );
    if (brandsForLetter.length === 0) return null;

    if(letter === "إ") return null;

    return (
      <div key={letter} id={`section-${letter}`} className={styles.brandGroup}>
        <h4>
          {letter === "ه"
            ? "هـ"
            : alphabetData[language?.startsWith("ar-") ? "ar" : "en"][letter] ||
              letter}
        </h4>
        <div className={styles.brandColumn}>
          {brandsForLetter
            .filter((x) => {
              const firstChar = normalizeArabicLetter(x.name[0]?.toLowerCase());
              return firstChar === letter;
            })
            .sort((a, b) =>
              a.name.localeCompare(
                b.name,
                language.startsWith("ar") ? "ar" : "en"
              )
            )
            .map(({ id, name }, ind) => (
              <div key={ind} className={styles.brandName} data-name={id}>
                <Link
                  className={
                    !brandPages.find((x) =>
                      x.url.toLowerCase().includes(id.toLowerCase())
                    ) && styles.disabled
                  }
                  target="_self"
                  href={`${
                    brandPages.find((x) =>
                      x.url.toLowerCase().includes(id.toLowerCase())
                    )?.url ?? "/"
                  }`}
                >
                  {highlightText(name, searchTerm)}
                </Link>
              </div>
            ))}
        </div>
      </div>
    );
  }
  
  const normalizeArabicLetter = (char) => {
    if (!char) return char;
  
    // Normalize common Arabic letter variants
    const map = {
      "إ": "أ"
    };
  
    return map[char] || char;
  };

  const getFirstLetterKey = (name) => {
    if (!name) return;
  
    let letter = name[0]?.toLowerCase();
  
    // Normalize Arabic letters
    if (language?.startsWith("ar-")) {
      letter = normalizeArabicLetter(letter);
    }
  
    const alphabet = alphabetData[language?.startsWith("ar-") ? "ar" : "en"];
    const foundKey = Object.entries(alphabet).find(([k, v]) => v === letter);
    return foundKey?.[0];
  };

  return (
    <div className={styles.brandSectionContainer}>

      {/* TODO: Uncomment once Accounts BAA Search are approved */}
      {/* <div className={styles.searchInputContainer}>
        <SearchIcon fill="#403F3D" className={styles.searchIcon} />

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search"
          className={styles.searchInput}
        />
      </div> */}

      {/* Alphabet Navigation */}
      <div
        ref={alphabetNavRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        className={styles.alphabetNav}
      >
        {Object.entries(alphabetData[language?.startsWith("ar-") ? "ar" : "en"]).map(([key, letter]) => {
          const isEnabled = brands?.some((x) => getFirstLetterKey(x.name) === key);

          return (
            <button
              key={key}
              className={`${styles.alphabetLetter} ${isEnabled ? styles.enabled : styles.disabled}`}
              onClick={() => handleLetterClick(letter)}
              disabled={!isEnabled}
            >
              {letter === "ه" ? "هـ" : letter}
            </button>
          );
        })}
      </div>

      {/* Brand List */}
      {filteredBrands.length === 0 ? (
        <div className={styles.noResultsMessage}>No search results found.</div>
      ) : (
        <>
          {haveScrollbars ? (
            <SimpleBar style={{ maxHeight: 266 }} className={styles.simpleScrollbar}>
              <div className={`${height && styles.brandListHeight} ${styles.brandList}`} ref={brandListRef}>
                {enabledAlphabets?.map((letter) => renderBrandSection(letter))}
              </div>
            </SimpleBar>
          ) : (
            <div className={`${height && styles.brandListHeight} ${styles.brandList}`} ref={brandListRef}>
              {enabledAlphabets?.map((letter) => renderBrandSection(letter))}
            </div>
          )}
        </>
      )}

      {content?.viewAllBrandsCta && (
        <div className={styles.btnContainer}>
          <Button
            isLink={true}
            link={content?.viewAllBrandsCta?.url}
            title={content?.viewAllBrandsCta?.label}
            color={content?.viewAllBrandsCta?.color}
            type={content?.viewAllBrandsCta?.type}
          />
        </div>
      )}
    </div>
  );
};

export default BrandListing;
