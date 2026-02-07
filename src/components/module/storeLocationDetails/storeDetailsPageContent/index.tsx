import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./storeDetailsPageContent.module.scss";
import Typography from "../../typography";
import RichText from "../../richText";
import SideDrawer from "../../sideDrawer";
import { Button, Loader } from "@components/module";
import Image from "@components/module/image";
import { getStores } from "@utils/sfcc-connector/dataService";
import { TimeIcon } from "@assets/images/svg";
import { ServiceIcon } from "@assets/images/svg";
import { BrandsIcon } from "@assets/images/svg";
import { WhatsappIcon } from "@assets/images/svg";
import { MapIcon } from "@assets/images/svg";
import { StoreDetailsProps } from "@utils/models/storeLocatorDetails";
import SlidingRadioSwitch from "@components/module/slidingRadioSwitch";
import MapView from "@components/module/mapView";
import { ArrowRight } from "@assets/images/svg";
import { useDeviceWidth } from "@utils/useCustomHooks";
import BrandPopup from "@components/module/storeLocationDetails/brandPopUp";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { LanguageContext } from "@contexts/languageContext";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";
import classNames from "classnames";

const StoreDetailsPageContent: React.FC<StoreDetailsProps> = ({ store, mapViewOn }) => {
  const router = useRouter();
  const { mapView } = router.query; 
  const swiperRef = useRef(null);
  const [matchedStore, setMatchedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [activeToggle, setActiveToggle] = useState(true);
  const isMobile = !useDeviceWidth()[0];
  const [isAllBrandPopupOpen, setAllBrandPopupOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
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

  const handleStoreClick = (index) => {
    setMatchedStore(stores[index]); // Set the clicked store as active
  };

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

  const handleToggleChange = (toggle) => {
    setTimeout(() => {
      setActiveToggle(toggle);
    }, 300);
  };

  const brandsToDisplay = matchedStore?.c_availableBrands?.slice(0, 8);

  return (
    <div className={styles.mainWrapper}>
      {loading && 
        <Loader />
      }
      <div className={styles.backBtn} onClick={handleBackButtonClick}>
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
      </div>
      <div className={styles.mapViewWrapper}>
        {/* <SlidingRadioSwitch
          toggleLabel={"Map View"}
          onToggle={handleToggleChange}
          value ={activeToggle}
        /> */}
      </div>
      <div className={styles.contentOuterWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.storeImageWrapper}>
            {!activeToggle ? (
              <div className={styles.twoColumnLayout}>
                <div className={styles.infoTwoColumn}>
                  <div className={styles.content}>
                    <Typography variant="h3" className={styles.title}>
                      {matchedStore?.c_nameCustom}
                    </Typography>
                  </div>
                  <div className={styles.locationInfo}>
                    <div className={styles.leftSection}>
                      <MapIcon className={styles.mapIcon} />
                      <span className={classNames(styles.addressWrapper, styles.vline)}>
                        <Typography variant="p" className={styles.storeCity}>
                          {matchedStore?.c_cityCustom}
                        </Typography>
                        <Typography variant="p" className={styles.storeAddress}>
                          {matchedStore?.c_address1Custom}
                        </Typography>
                      </span>
                    </div>
                    <span className={styles.directionBtnWrapper}>
                      <a
                        href={matchedStore?.c_googleMapLocation}
                        target="_blank"
                        className={`${styles.storeMapLink} button plain brown_dark`}
                      >
                        <span>{findABoutiqueListingStaticData[language].getDirections}</span>
                      </a>
                    </span>
                  </div>
                  <hr className={styles.divider} />

                  <div className={styles.storeContactWrapper}>
                    <div className={styles.leftSection}>
                      <WhatsappIcon
                        className={styles.WhatsappIcon}
                        strokeColor="#464f4a"
                      />
                      <span className={styles.contactLabelWrapper}>
                        <Typography variant="p" className={styles.contactLabel}>
                          {findABoutiqueListingStaticData[language].getInTouch}
                        </Typography>
                      </span>
                    </div>
                    <span className={styles.contactWrapper}>
                      <Button
                          isLink={true}
                          link={`tel:${matchedStore?.phone?.replace(/\s+/g, '')}`}
                          title={findABoutiqueListingStaticData[language].call}
                          color={"brown_dark"}
                          type={"Plain"}
                          className={styles.contactBtn}
                      />
                      <div className={styles.vDivider}>&nbsp;</div>
                      <Button
                          isLink={true}
                          link={`https://wa.me/${matchedStore?.fax?.replace(/\s+/g, '')}`}
                          className={styles.whatsappBtn}
                          title={findABoutiqueListingStaticData[language].whatsappLabel}
                          color="brown_dark"
                          type={"Plain"}
                      />
                    </span>
                  </div>

                  <hr className={styles.divider} />
                  <div className={styles.storeTimingWrapper}>
                    <div className={styles.timingRow}>
                      <div className={styles.iconWrapper}>
                        <TimeIcon className={styles.timeIcon} />
                      </div>
                      <div className={styles.timingItems}>
                        {formattedStoreHours.map((item, index) => (
                          <div className={styles.timingDetail} key={index}>
                            <Typography
                              variant="p"
                              className={styles.storeOpenDay}
                            >
                              {item.days}
                            </Typography>
                            <Typography
                              variant="p"
                              className={styles.storeOpenTiming}
                            >
                              {item.timings}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className={styles.divider} />
                  {matchedStore?.c_services && matchedStore.c_services.length > 0 ? (
                          <>
                            <div className={styles.serviceWrapper}>
                              <div className={styles.iconSection}>
                                <ServiceIcon className={styles.serviceIcon} />
                              </div>
                              <div className={styles.storeServiceInfo}>
                                <ul className={styles.serviceList}>
                                  {matchedStore.c_services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className={styles.bookAppointment}>
                                {/* Button or other content here */}
                              </div>
                            </div>
                            <hr className={styles.divider} />
                          </>
                        ) : null}

                  <div className={styles.storeBrandsInfo}>
                    <div className={styles.iconSection}>
                      <BrandsIcon className={styles.brandsIcon} />
                    </div>
                    <span className={styles.availableBrandsLabel}>
                      <Typography
                        variant="p"
                        className={styles.availableBrandsTitle}
                      >
                        {findABoutiqueListingStaticData[language].brandsAvailable}
                      </Typography>
                    </span>
                    {matchedStore?.c_availableBrands?.length > 8 && (
                      <span className={styles.viewAllBrands}>
                        <Button
                          isLink={false}
                          className={styles.viewAllBrandsBtn}
                          title={findABoutiqueListingStaticData[language].viewAllBrands}
                          color="brown_dark"
                          type={"Plain"}
                          clickHandler={handleViewAllBrands}
                        />
                      </span>
                    )}
                  </div>

                  <div className={classNames(styles.brandsWrapper, styles.vline)}>
                    {brandsToDisplay &&
                      brandsToDisplay.map((availableBrand, index) => (
                          <p key={index} className={styles.brandsName}>{availableBrand}</p>
                      ))}
                  </div>
                  <hr className={styles.divider} />
                </div>
                <div className={styles.imageContainer}>
                  <img
                    className={styles.storeImg}
                    src={storeImage}
                    alt={matchedStore?.name}
                  />
                </div>
                {
                  <BrandPopup
                    brands={matchedStore.c_availableBrands}
                    onClose={handleClosePopup}
                    isOpen={isAllBrandPopupOpen}
                  />
                }
              </div>
            ) : (
              <div className={styles.mapOuterContainer}>
                <div className={styles.mapContainer}>
                  <div className={styles.fullWidthMap}>
                    {matchedStore && <MapView
                      nearestStore={null}
                      stores={stores}
                      activeStore={matchedStore}
                      userLocation={null}
                      useOnPopup={false}
                      handleStoreClick={handleStoreClick}
                      swiperRef = {null}
                    />}
                  </div>
                  <div className={styles.infoOverlay}>
                  {/* <div className={styles.mapInfoContainer}> */}
                  {!isMobile ? ( <Swiper
                      direction={"vertical"}
                      spaceBetween={0}
                      slidesPerView={"auto"}
                      scrollbar={{ dragSize: 160, draggable: true }}
                      mousewheel={true}
                      className={styles.storeMapListSwiper}
                      ref={swiperRef}
                      onSlideChange={null}
                      modules={[ Scrollbar, Mousewheel]}
                      autoHeight={true}
                    >

                    <SwiperSlide>
                    <div className={styles.infoWrapper}>
                    <div className={styles.content}>
                      <Typography variant="h3" className={styles.title}>
                        {matchedStore?.c_nameCustom}
                      </Typography>
                    </div>
                    <div className={styles.locationInfo}>
                      <div className={styles.leftSection}>
                        <MapIcon className={styles.mapIcon} />
                        <span className={classNames(styles.addressWrapper, styles.vline)}>
                          <Typography variant="p" className={styles.storeCity}>
                            {matchedStore?.c_cityCustom}
                          </Typography>
                          <Typography variant="p" className={styles.storeAddress}>
                            {matchedStore?.c_address1Custom}
                          </Typography>
                        </span>
                      </div>
                      <span className={styles.directionBtnWrapper}>
                        <a
                          href={matchedStore?.c_googleMapLocation}
                          target="_blank"
                          className={`${styles.storeMapLink} button plain brown_dark`}
                        >
                          <span>{findABoutiqueListingStaticData[language].getDirections}</span>
                        </a>
                      </span>
                    </div>
                    <hr className={styles.divider} />

                    <div className={styles.storeContactWrapper}>
                      <div className={styles.leftSection}>
                        <WhatsappIcon
                          className={styles.WhatsappIcon}
                          strokeColor="#464f4a"
                        />
                        <span className={styles.contactLabelWrapper}>
                          <Typography variant="p" className={styles.contactLabel}>
                            {findABoutiqueListingStaticData[language].getInTouch}
                          </Typography>
                        </span>
                      </div>
                      <span className={styles.contactWrapper}>
                      <Button
                          isLink={true}
                          link={`tel:${matchedStore?.phone?.replace(/\s+/g, '')}`}
                          title={findABoutiqueListingStaticData[language].call}
                          color={"brown_dark"}
                          type={"Plain"}
                          className={styles.contactBtn}
                      />
                        <div className={styles.vDivider}>&nbsp;</div>
                        <Button
                          isLink={true}
                          link={`https://wa.me/${matchedStore?.fax?.replace(/\s+/g, '')}`}
                          className={styles.whatsappBtn}
                          title={findABoutiqueListingStaticData[language].whatsappLabel}
                          color="brown_dark"
                          type={"Plain"}
                      />
                      </span>
                    </div>
            

                    <hr className={styles.divider} />
                    {/* </SwiperSlide>
                    <SwiperSlide> */}
                    <div className={styles.storeTimingWrapper}>
                      <div className={styles.timingRow}>
                        <div className={styles.iconWrapper}>
                          <TimeIcon className={styles.timeIcon} />
                        </div>
                        <div className={styles.timingItems}>
                          {formattedStoreHours.map((item, index) => (
                            <div className={styles.timingDetail} key={index}>
                              <Typography
                                variant="p"
                                className={styles.storeOpenDay}
                              >
                                {item.days}
                              </Typography>
                              <Typography
                                variant="p"
                                className={styles.storeOpenTiming}
                              >
                                {item.timings}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
            

                    <hr className={styles.divider} />

                    {/* {matchedStore?.c_services && matchedStore.c_services.length > 0 ? (
                          <>
                            <div className={styles.serviceWrapper}>
                              <div className={styles.iconSection}>
                                <ServiceIcon className={styles.serviceIcon} />
                              </div>
                              <div className={styles.storeServiceInfo}>
                                <ul className={styles.serviceList}>
                                  {matchedStore.c_services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className={styles.bookAppointment}>
                                
                              </div>
                            </div>
                            <hr className={styles.divider} />
                          </>
                        ) : null}
                    */}
                    
                    <div className={styles.storeBrandsInfo}>
                      <div className={styles.iconSection}>
                        <BrandsIcon className={styles.brandsIcon} />
                      </div>
                      <span className={styles.availableBrandsLabel}>
                        <Typography
                          variant="p"
                          className={styles.availableBrandsTitle}
                        >
                          {findABoutiqueListingStaticData[language].brandsAvailable}
                        </Typography>
                      </span>
                      {matchedStore?.c_availableBrands?.length > 8 && (
                        <span className={styles.viewAllBrands}>
                          <Button
                            isLink={false}
                            className={styles.viewAllBrandsBtn}
                            title={findABoutiqueListingStaticData[language].viewAllBrands}
                            color="brown_dark"
                            type={"Plain"}
                            clickHandler={handleViewAllBrands}
                          />
                        </span>
                      )}
                    </div>

                    <div className={classNames(styles.brandsWrapper, styles.vline)}>
                      {brandsToDisplay &&
                        brandsToDisplay.map((availableBrand, index) => (
                            <p key={index} className={styles.brandsName}>{availableBrand}</p>
                        ))}
                    </div>
                    <hr className={styles.divider} />
                    </div>
                    </SwiperSlide>

                    </Swiper>) :
                    (
                    <div className={styles.noSlideContainer}>
                    <div className={styles.content}>
                      <Typography variant="h3" className={styles.title}>
                        {matchedStore?.c_nameCustom}
                      </Typography>
                    </div>
                    <div className={styles.locationInfo}>
                      <div className={styles.leftSection}>
                        <MapIcon className={styles.mapIcon} />
                        <span className={classNames(styles.addressWrapper, styles.vline)}>
                          <Typography variant="p" className={styles.storeCity}>
                            {matchedStore?.c_cityCustom}
                          </Typography>
                          <Typography variant="p" className={styles.storeAddress}>
                            {matchedStore?.c_address1Custom}
                          </Typography>
                        </span>
                      </div>
                      <span className={styles.directionBtnWrapper}>
                        <a
                          href={matchedStore?.c_googleMapLocation}
                          target="_blank"
                          className={`${styles.storeMapLink} button plain brown_dark`}
                        >
                          <span>{findABoutiqueListingStaticData[language].getDirections}</span>
                        </a>
                      </span>
                    </div>
                    <hr className={styles.divider} />

                    <div className={styles.storeContactWrapper}>
                      <div className={styles.leftSection}>
                        <WhatsappIcon
                          className={styles.WhatsappIcon}
                          strokeColor="#464f4a"
                        />
                        <span className={styles.contactLabelWrapper}>
                          <Typography variant="p" className={styles.contactLabel}>
                            {findABoutiqueListingStaticData[language].getInTouch}
                          </Typography>
                        </span>
                      </div>
                      <span className={styles.contactWrapper}>
                      <Button
                          isLink={true}
                          link={`tel:${matchedStore?.phone?.replace(/\s+/g, '')}`}
                          title={findABoutiqueListingStaticData[language].call}
                          color={"brown_dark"}
                          type={"Plain"}
                          className={styles.contactBtn}
                      />
                        <div className={styles.vDivider}>&nbsp;</div>
                        <Button
                          isLink={true}
                          link={`https://wa.me/${matchedStore?.fax?.replace(/\s+/g, '')}`}
                          className={styles.whatsappBtn}
                          title={findABoutiqueListingStaticData[language].whatsappLabel}
                          color="brown_dark"
                          type={"Plain"}
                      />
                      </span>
                    </div>
            

                    <hr className={styles.divider} />
                    <div className={styles.storeTimingWrapper}>
                      <div className={styles.timingRow}>
                        <div className={styles.iconWrapper}>
                          <TimeIcon className={styles.timeIcon} />
                        </div>
                        <div className={styles.timingItems}>
                          {formattedStoreHours.map((item, index) => (
                            <div className={styles.timingDetail} key={index}>
                              <Typography
                                variant="p"
                                className={styles.storeOpenDay}
                              >
                                {item.days}
                              </Typography>
                              <Typography
                                variant="p"
                                className={styles.storeOpenTiming}
                              >
                                {item.timings}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <hr className={styles.divider} />

                    {matchedStore?.c_services && matchedStore.c_services.length > 0 ? (
                          <>
                            <div className={styles.serviceWrapper}>
                              <div className={styles.iconSection}>
                                <ServiceIcon className={styles.serviceIcon} />
                              </div>
                              <div className={styles.storeServiceInfo}>
                                <ul className={styles.serviceList}>
                                  {matchedStore.c_services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className={styles.bookAppointment}>
                                {/* Button or other content here */}
                              </div>
                            </div>
                            <hr className={styles.divider} />
                          </>
                        ) : null}
                    <div className={styles.storeBrandsInfo}>
                      <div className={styles.iconSection}>
                        <BrandsIcon className={styles.brandsIcon} />
                      </div>
                      <span className={styles.availableBrandsLabel}>
                        <Typography
                          variant="p"
                          className={styles.availableBrandsTitle}
                        >
                          {findABoutiqueListingStaticData[language].brandsAvailable}
                        </Typography>
                      </span>
                      {matchedStore?.c_availableBrands?.length > 8 && (
                        <span className={styles.viewAllBrands}>
                          <Button
                            isLink={false}
                            className={styles.viewAllBrandsBtn}
                            title={findABoutiqueListingStaticData[language].viewAllBrands}
                            color="brown_dark"
                            type={"Plain"}
                            clickHandler={handleViewAllBrands}
                          />
                        </span>
                      )}
                    </div>

                    <div className={classNames(styles.brandsWrapper, styles.vline)}>
                      {brandsToDisplay &&
                        brandsToDisplay.map((availableBrand, index) => (
                            <p key={index} className={styles.brandsName}>{availableBrand}</p>
                        ))}
                    </div>
                    <hr className={styles.divider} />
                    </div>

                    )}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            )}
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
  );
};

export default StoreDetailsPageContent;
