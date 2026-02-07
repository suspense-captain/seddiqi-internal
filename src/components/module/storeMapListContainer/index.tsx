import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./storeMapListContainer.module.scss";
import { LocationIcon } from "@assets/images/svg";
import { StoreLocationDetails } from "@components/module";

import { FreeMode, Scrollbar, Mousewheel } from "swiper/modules";
import { useRouter } from "next/router";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { LanguageContext } from "@contexts/languageContext";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";

interface StoreMapListContainerProps {
  storesList: Array<any>;
  activeIndex: number;
  handleStoreClick: (index: number) => void;
  isMobile: boolean;
  isAbsolutePosition: boolean;
  needScrollbar: boolean;
  useOnPopup?: boolean;
  brandName?: string;
}

const StoreMapListContainer: React.FC<StoreMapListContainerProps> = ({
  storesList,
  activeIndex,
  handleStoreClick,
  isMobile,
  isAbsolutePosition,
  needScrollbar,
  useOnPopup,
  brandName
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [mapViewOn, setMapViewOn] = useState(false);
  const swiperRef = useRef(null);
  const [swiperHeight, setSwiperHeight] = useState(0);
  const router = useRouter();
  const storeRefs = useRef([]);

  const { language } = useContext(LanguageContext);
  const texts = findABoutiqueListingStaticData[language]

  const handleStoreDtetails = (store) => {
    setSelectedStoreId(store.id);
    setMapViewOn(true);
    //setIsDetailsOpen(true);
    setMapViewOn(true);
    if (useOnPopup) {
      // Show StoreLocationDetails as a popup
      setIsDetailsOpen(true);
    } else {
      // Redirect to details page
      handleStoreDetailsPage(store.id, true);
    }
  };

  const handleListStoreClick = (index: number) => {
    // if (isMobile && storeRefs.current[index]) {
    //   storeRefs.current[index].scrollIntoView({
    //     behavior: 'smooth',  
    //     block: 'center',
    //   });
    // }

    handleStoreClick(index);
  };

  const scrollToStore = (index: number) => {
    if (isMobile && storeRefs.current[index]) {
      storeRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // useEffect(() => {
  //   scrollToStore(activeIndex)
  // }, [activeIndex]);

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedStoreId(null);
    setMapViewOn(false);
  };

  const handleStoreDetailsPage = (storeId, showMapView = false) => {
    router.push({
      pathname: `/${language}/find-a-boutique-details/${storeId}`,
      query: { mapView: showMapView ? "true" : "false" },
    });
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperInstance = swiperRef.current.swiper;
      
      // Get the wrapper element and calculate the full height including offset
      const wrapper = swiperInstance.wrapperEl;
      const offset = 30; // Adjust this to match your margin-top
  
      // Update height calculation to account for offset
      const totalHeight = swiperInstance.height + offset;
      
      // Set the updated swiper height, ensuring the last item isn't cut off
      setSwiperHeight(totalHeight);
      swiperInstance.update();
  
      // Slide to the activeIndex
      swiperInstance.slideTo(activeIndex, 1000, false);
    }
  }, [activeIndex]);

  useEffect(() => {
    const updateSwiper = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.update();
      }
    };

    updateSwiper();

    const handleResize = () => {
      updateSwiper();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [storesList]);

  const handleSlideChange = () => {
    const swiperInstance = swiperRef.current.swiper;
    if (swiperInstance) {
      const offset = 30; // Adjust this to the number of pixels you want at the top
      const wrapper = swiperInstance.wrapperEl;

      // Apply the offset to the swiper container after slide change
      setTimeout(() => {
        wrapper.style.marginTop = `${offset}px`;
      }, 300); // Allow time for the slide transition to complete
    }
  };

  return (
    <>
      <div
        className={`${[styles.storeMapListContainer]} ${isAbsolutePosition === true ? "" : styles.isRelative} ${
          needScrollbar === true ? "" : styles.noScrollbar
        }`}
      >
        {!isMobile && needScrollbar === true ? (
          <Swiper
            direction={"vertical"}
            spaceBetween={20}
            slidesPerView={"auto"}
            scrollbar={{ dragSize: 160, draggable: true }}
            mousewheel={true}
            freeMode={true}
            modules={[FreeMode, Scrollbar, Mousewheel]}
            breakpoints={{
              768: {
                spaceBetween: 32,
              }
            }}
            className={styles.storeMapListSwiper}
            ref={swiperRef}
            onSlideChange={handleSlideChange}
          >
            
              <ul className={styles.storeMapList}>
                {storesList.map((store, index) => (
                  <SwiperSlide key={store.id}>
                  <li className={`${styles.storeMap} ${activeIndex === index ? styles.isActive : ""}`}
                    onClick={() => handleStoreClick(index)}>
                    <div className={styles.storeMapDetails}>
                      <h4 className={styles.storeMapName}>{store.c_nameCustom}</h4>
                      <div className={styles.storeMapLocation}>
                        <div className={styles.locationContainer}>
                          {/* <LocationIcon /> */}
                          <p className={styles.vLine}>
                            <span>
                              <LocationIcon /> {store.c_cityCustom}
                            </span>
                            {store.c_address1Custom && <span>{store.c_address1Custom}</span>}
                          </p>
                        </div>

                        {store.distance !== null ? (
                          <p className={styles.storeMapDistance}>
                            {store.distance} {store.distanceUnit}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.storeMapLinksContainer}>
                      <a
                        href="/"
                        target="_blank"
                        className={`${styles.storeMapLink} button plain black_dark`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleStoreDtetails(store);
                        }}
                      >
                        <span>{texts?.viewDetails || "View Details"}</span>
                      </a>
                      <a
                        href={store.c_googleMapLocation}
                        target="_blank"
                        className={`${styles.storeMapLink} button plain black_dark`}
                      >
                        <span>{texts?.getDirections || "Get Directions"}</span>
                      </a>
                    </div>
                  </li>
                  </SwiperSlide>
                ))}
              </ul>
            
          </Swiper>
        ) : (
          <ul className={styles.storeMapList}>
            {storesList.map((store, index) => (
              <li
                key={store.id}
                ref={(el) => storeRefs.current[index] = el}
                className={`${styles.storeMap} ${activeIndex === index ? styles.isActive : ""}`}
                onClick={() => handleListStoreClick(index)}
              >
                <div className={styles.storeMapDetails}>
                  <h4 className={styles.storeMapName}>{store.c_nameCustom}</h4>
                  <div className={styles.storeMapLocation}>
                    <div className={styles.locationContainer}>
                      {/* <LocationIcon /> */}
                      <p className={styles.vLine}>
                        <span>
                          <LocationIcon /> {store.c_cityCustom}
                        </span>
                        {store.c_address1Custom && <span>{store.c_address1Custom}</span>}
                      </p>
                    </div>
                    {store.distance !== null ? (
                      <p className={styles.storeMapDistance}>
                        {store.distance} {store.distanceUnit}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.storeMapLinksContainer}>
                  <a
                    href="/"
                    target="_blank"
                    className={`${styles.storeMapLink} button plain black_dark`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStoreDtetails(store);
                    }}
                  >
                    <span>{texts?.viewDetails || "View Details"}</span>
                  </a>
                  <a
                    href={store.c_googleMapLocation}
                    target="_blank"
                    className={`${styles.storeMapLink} button plain black_dark`}
                  >
                    <span>{texts?.getDirections || "Get Directions"}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isDetailsOpen && (
        <>
          <div className={styles.storeDetailsBackdrop} onClick={handleCloseDetails} />
          <StoreLocationDetails
            storeId={selectedStoreId}
            isOpen={isDetailsOpen}
            onClose={handleCloseDetails}
            mapViewOn={mapViewOn}
            useOnPopup={true}
            stores={storesList}
            brandName={brandName}
          />
        </>
      )}
    </>
  );
};

export default StoreMapListContainer;
