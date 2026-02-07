import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import styles from "./rolexMapStoreDetailsPageContent.module.scss";
import { Loader, Typography } from "@components/module";
import { getStores } from "@utils/sfcc-connector/dataService";
import { RolexMapPoint, RolexPhone, TimeIcon } from "@assets/images/svg";
import { RolexMapStoreDetailsProps } from "@utils/models/storeLocatorDetails";
import MapView from "@components/module/mapView";
import { useDeviceWidth } from "@utils/useCustomHooks";
import BrandPopup from "@components/module/storeLocationDetails/brandPopUp";
import { useRouter } from "next/router";
import { LanguageContext } from "@contexts/languageContext";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";
import classNames from "classnames";
import Link from "next/link";
import { RolexNavbar } from "@components/rendering/rolex";
import RolexMailIcon from "@assets/images/svg/RolexMailIcon";

const RolexMapStoreDetailsPageContent: React.FC<RolexMapStoreDetailsProps> = ({ store, mapViewOn, content }) => {
  const router = useRouter();
  const [matchedStore, setMatchedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [activeToggle, setActiveToggle] = useState(true);
  const [isAllBrandPopupOpen, setAllBrandPopupOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [isTimingOpen, setIsTimingOpen] = useState(false);
  const timingRowRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      setActiveToggle(true);
    }, 300);
  }, []);
  

  const handleBackButtonClick = () => {
    router.push('/find-a-boutique-listing');
  };

  const handleViewAllBrands = () => {
    setAllBrandPopupOpen(true);
  };

  const handleClosePopup = () => {
    setAllBrandPopupOpen(false);
  };

  const handleStoreClick = useCallback((index) => {
    setMatchedStore(stores[index]);
  }, [stores]);

  useEffect(() => {
    const fetchStoresData = async () => {
      try {
        const response = await getStores({
          method: "GET",
          brand: "",
          city: "",
          name: "",
          service: "",
          lat: null,
          lng: null,
          storeIds: "",
          locale: language
        });
        const fetchedStores = response?.response || [];
        setStores(fetchedStores);
        const storeId = store;
        const matchedStore = fetchedStores.find(
          (store) => store.id === storeId
        );
        setMatchedStore(matchedStore);
      } catch (error) {
        console.error("Error fetching stores:", error);
        router.push("/500")
      } finally {
        setLoading(false);
      }
    };

    const matchesLocale = language.toLowerCase() === router.locale.toLowerCase();

    // Fetch the user's location once on initial mount
    if (matchesLocale && !hasFetched.current) {
      hasFetched.current = true;
      fetchStoresData();
    }

  
  }, [stores, language, router.locale, router.isReady]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timingRowRef.current &&
        !timingRowRef.current.contains(event.target as Node)
      ) {
        setIsTimingOpen(false); 
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const memoizedMapView = useMemo(() => {
    if (!matchedStore) return null;
  
    return (
      <MapView
        nearestStore={null}
        stores={stores}
        activeStore={matchedStore}
        userLocation={null}
        useOnPopup={false}
        handleStoreClick={handleStoreClick}
        swiperRef={null}
        isPinCenter={true}
        showOnlyActiveStore={false}
      />
    );
  }, [stores, matchedStore]);

  if (loading) {
    return <Loader />;
  }

  if (!matchedStore) {
    return null;
  }

  // Store data from matchedStore
  const storeImage = matchedStore?.c_storeImage;
  const storeHoursString = matchedStore.storeHours || "";

  const storeHoursArray = JSON.parse(storeHoursString);

  const formattedStoreHours = storeHoursArray.map((line) => {
    const parts = line.split(": ");

    if (storeHoursArray.length === 1) {
      // Case without colon: "Closed for Renovation" - just display the text
      return { days: parts[0], timings: "" };
    } else {
      // Case with colon: "Monday: 9:00 AM - 6:00 PM"
      const [days, timings] = parts;
      const localizedDayText = findABoutiqueListingStaticData[language][days.trim().toLowerCase()];
      return { days: localizedDayText, timings: timings.trim() };
    }
  });

  const brandsToDisplay = matchedStore?.c_availableBrands?.slice(0, 8);

  const getTodayName = () => {
    const daysOfWeek = [
      "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
    ];
    const today = new Date().getDay(); // 0 (Sun) - 6 (Sat)
    return daysOfWeek[today];
  };
  
  const todayKey = getTodayName(); // e.g., "monday"
  const todayLocalized = findABoutiqueListingStaticData[language][todayKey];

  const todayTiming = formattedStoreHours.find(
    (item) => item.days.toLowerCase().trim() === todayLocalized.toLowerCase().trim()
  );

  const getGoogleMapsDirectionUrl = (store: any) => {
    const userPath = userLocation
      ? `&origin=${userLocation.lat},${userLocation.lng}`
      : "";
    const mapPath = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}${userPath}`;
    return mapPath;
  };

  const formatTel = (phone: string) => `${phone.replace(/\s+/g, "")}`;

  return (
    <>
    <div className={styles.navBarContainer}>
    <RolexNavbar content={content} storeName={matchedStore?.c_nameCustom} />
    </div>
    
    <div className={styles.mainWrapper}>
      {loading && 
        <Loader />
      }
      {/* <div className={styles.backBtn} onClick={handleBackButtonClick}>
        <div className={styles.arrowLeftWrapper}>
          <ArrowRight fill="black" className={styles.arrowLeft} />
        </div>
        <div className={styles.backButtonContent}>
          <Typography
            align="left"
            variant="span"
            className={styles.backButtonText}
          >
           {findABoutiqueListingStaticData[language].backLabel}
          </Typography>
          <div className={styles.underline} />
        </div>
      </div> */}
      <div className={styles.contentOuterWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.storeImageWrapper}>
            
            <div className={styles.mapOuterContainer}>
              <div className={styles.mapContainer}>
                <div className={styles.fullWidthMap}>
                {memoizedMapView}
                </div>
                <div className={styles.infoOverlay}>
                <div className={styles.infoWrapper}>
                  <div className={styles.content}>
                    <Typography variant="h3" className={styles.title}>
                      {matchedStore?.c_nameCustom}
                    </Typography>
                  </div>
                  <div className={styles.locationInfo}>
                    <div className={styles.leftSection}>
                      <span className={classNames(styles.addressWrapper, styles.vline)}>
                        {matchedStore?.c_address1Custom &&
                        <Typography variant="p" className={styles.storeAddress}>
                          {matchedStore?.c_address1Custom}
                        </Typography>
                        }

                        {matchedStore?.c_cityCustom &&
                        <Typography variant="p" className={styles.storeCity}>
                          {matchedStore?.c_cityCustom}
                        </Typography>
                        }
                      </span>
                    </div>
                  </div>

                  <div className={styles.storeTimingWrapper}>
                    <div
                      className={styles.timingRow}
                      onClick={() => setIsTimingOpen(prev => !prev)}
                      ref={timingRowRef}
                    >
                        <div className={styles.timingItems}>
                            <div className={styles.timingDetail}>
                            <Typography variant="p" className={styles.storeOpenDay}>
                                <strong>Open today</strong> {/*{todayTiming?.days} */}
                            </Typography>
                            <Typography
                              variant="p"
                              className={classNames(styles.storeOpenTiming, {
                                [styles.isShowing]: isTimingOpen,
                              })}
                            >
                              {todayTiming?.timings}
                            </Typography>
                          </div>
                          
                        </div>

                        <div className={classNames(styles.fullTimings, { [styles.isShowing]: isTimingOpen })}>
                          {formattedStoreHours.map((item, index) => (
                              <div className={styles.timingDetail} key={index}>
                                <Typography variant="p" className={styles.storeOpenDay}>
                                  {item.days}
                                </Typography>
                                <Typography variant="p" className={styles.storeOpenTiming}>
                                  {item.timings}
                                </Typography>
                              </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  <div className={styles.cardIcons}>

                    
                      {matchedStore.phone && (
                        <div className={styles.cardIconContainer}>
                          <a href={`tel:${formatTel(matchedStore.phone)}`} className={styles.iconTextContainer}>
                            <div className={styles.cardIcon}>
                              <RolexPhone />
                            </div>

                            <Typography variant="p">{formatTel(matchedStore.phone)}</Typography>
                          </a>
                        </div>
                      )}

                      <div className={styles.cardIconContainer}>
                        <a target="_blank" href="mailto:info@seddiqi.com" className={`${styles.iconTextContainer} ${styles.strokeOnly}`}>
                          <div className={styles.cardIcon}>
                            <RolexMailIcon />
                          </div>

                          <Typography variant="p">Send Message</Typography>
                        </a>
                    </div>
                    
                    {matchedStore.c_googleMapLocation && matchedStore?.latitude && matchedStore?.longitude && (
                      <div className={styles.cardIconContainer}>
                        <a target="_blank" href={getGoogleMapsDirectionUrl(matchedStore)} className={styles.iconTextContainer}>
                          <div className={styles.cardIcon}>
                            <RolexMapPoint />
                          </div>

                          <Typography variant="p">Get Directions</Typography>
                        </a>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {
        <BrandPopup
          brands={matchedStore.c_availableBrands}
          onClose={handleClosePopup}
          isOpen={isAllBrandPopupOpen}
        />
      }
    </div>
    </>
  );
};

export default RolexMapStoreDetailsPageContent;
