import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./bookAnAppointmentBrandListing.module.scss";
import Button from "../../button";
import Link from "next/link";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { SearchIcon, Tick } from "@assets/images/svg";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useBookAppointmentContext } from "@contexts/bookAppointmentContext";

const BookAnAppointmentBrandListing = ({ height = true, categories, brandPages = [], haveScrollbars, categoryType, ...content }) => {
  const alphabet = [...Array(26).keys()].map((i) => String.fromCharCode(i + 97));

  const [selectedLetter, setSelectedLetter] = useState("A");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);

  const [brands, setBrands] = useState(categories);

  const alphabetNavRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const brandListRef = useRef(null);
  const swiperRef = useRef(null);
  const isDesktop = useDeviceWidth();

  const { 
    selectedJewellery, 
    setSelectedJewellery, 
    selectedWatches, 
    setSelectedWatches, 
    handleCheckboxChange
  } = useBookAppointmentContext();

  function getSuggestionsFromLocalStorage() {
    const suggestions = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes("Suggestions")) {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          try {
            const parsedValue = JSON.parse(storedValue);
            if (Array.isArray(parsedValue)) {
              parsedValue.forEach((item) => {
                if (item.name) {
                  suggestions.push(item.name);
                }
              });
            }
          } catch (error) {
            console.error(`Error parsing JSON for key ${key}:`, error);
          }
        }
      }
    }

    return suggestions;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPopularSearches(getSuggestionsFromLocalStorage());
    }
  }, []);

  // Handle the letter click to scroll the brand list
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    const section = document.getElementById(`section-${letter}`);

    if (section && brandListRef.current) {
      if (isDesktop[0]) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        const containerTop = brandListRef.current.getBoundingClientRect().top + window.scrollY;

        const dynamicOffset = window.innerHeight * 0.1;
        const scrollToPosition = sectionTop - containerTop + window.scrollY + 150;

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
      const firstLetter = brand.id[0]?.toLowerCase();
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

  // const fetchBrands = async () => {
  //   const brands = await getCategory({ cgid: "seddiqi-storefront-catalog", method: "GET" });
  //   setBrands(brands?.response?.categories);
  // };

  useEffect(() => {
    setBrands(categories);
  }, [brands]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.searchWrapper}`)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Only render the section if there's at least one brand with a matching letter
  const renderBrandSection = (letter) => {
    const brandsForLetter = filteredBrands.filter((brand) =>
      brand.name.toLowerCase().startsWith(letter)
    );
    if (brandsForLetter.length === 0) return null;

    return (
      <div key={letter} id={`section-${letter}`} className={styles.brandGroup}>
        <h4>{letter}</h4>
        <div className={styles.brandColumn}>
          {brandsForLetter.map(({ id, name }, ind) => (
            <div key={ind} className={styles.brandName}>
              
              <label htmlFor={`checkbox-${name}`} className={styles.checkboxLabel}>
                <input
                  className={styles.inputCheckbox}
                  type="checkbox"
                  id={`checkbox-${name}`}
                  checked={selectedWatches.includes(name)}
                  onChange={() => handleCheckboxChange(name, categoryType)}
                />
                <div className={styles.checkbox}>
                  <Tick className={styles.tick} />
                </div>
                {highlightText(name, searchTerm)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.brandSectionContainer}>

      <div className={styles.searchInputContainer}>
        <SearchIcon fill="#403F3D" className={styles.searchIcon} />
        <div className={styles.searchWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search"
            className={styles.searchInput}
          />
          
          {showSuggestions && (
            <div className={styles.suggestionsContainer}>
              <div className={styles.suggestionSection}>
                <div className={styles.suggestionHeader}>Popular Searches</div>
                {popularSearches
                  .filter(search => 
                    search.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((search, index) => (
                    <div 
                      key={`popular-${index}`} 
                      className={styles.suggestionItem}
                      onClick={() => {
                        setSearchTerm(search);
                        setShowSuggestions(false);
                      }}
                    >
                      {highlightText(search, searchTerm)}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alphabet Navigation */}
      <div
        ref={alphabetNavRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        className={styles.alphabetNav}
      >
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
          <button
            key={letter}
            className={`${styles.alphabetLetter} ${
              brands.filter((x) => x.id.toLowerCase().startsWith(letter.toLowerCase())).length > 0
                ? styles.enabled
                : styles.disabled
            }`}
            onClick={() => handleLetterClick(letter.toLowerCase())}
            disabled={brands.filter((x) => x.id.toLowerCase().startsWith(letter.toLowerCase())).length < 1}
          >
            {letter}
          </button>
        ))}
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

export default BookAnAppointmentBrandListing;
