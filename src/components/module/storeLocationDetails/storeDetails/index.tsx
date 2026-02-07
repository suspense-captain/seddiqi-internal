import React, { useState, useEffect, useContext } from "react";
import styles from "./storeDetails.module.scss";
import Typography from "../../typography";
import RichText from "../../richText";
import SideDrawer from "../../sideDrawer";
import { Button } from "@components/module";
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
import BrandPopup from "@components/module/storeLocationDetails/brandPopUp";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import router from "next/router";

const StoreDetails: React.FC<StoreDetailsProps> = ({ store, mapViewOn, stores, brandName}) => {
  const [mapView, setMapView] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeToggle, setActiveToggle] = useState(mapViewOn);
  const [isAllBrandPopupOpen, setAllBrandPopupOpen] = useState(false);
  const storeImage = store?.c_storeImage;
  const storeHoursString = store?.storeHours;
  const [matchedStore, setMatchedStore] = useState(null);

  const storeHoursArray = JSON.parse(storeHoursString);
  const formattedStoreHours = storeHoursArray.map((line) => {
    const [days, timings] = line.split(": ");
    return { days: days.trim(), timings: timings.trim() };
  });

  const { 
      isFromStoreLocatorPdp
    } = useContext(BookAppointmentContext);

  useEffect(() => {
    setActiveToggle(mapViewOn);
  }, [mapViewOn]);

  const handleToggleChange = (toggle:boolean) => {
    setActiveToggle(toggle);
  };

  const handleViewAllBrands = () => {
    setAllBrandPopupOpen(true);
  };

  const handleClosePopup = () => {
    setAllBrandPopupOpen(false);
  };
  const brandsToDisplay = store?.c_availableBrands?.slice(0, 8);

  const handleBookAppointment = () => {
    if (brandName) {
      let brand = brandName;
      const lowerBrandName = brandName.toLowerCase();

      if (lowerBrandName.includes("rolex certified pre-owned")) {
        brand = "Rolex Certified Pre-Owned";
      } else if (lowerBrandName.includes("rolex")) {
        brand = "Rolex";
      }
      
      localStorage.setItem("selectedWatches", JSON.stringify([brand]));
      localStorage.setItem("selectedStore",  JSON.stringify(store));
      localStorage.setItem("isFromStoreLocatorPdp", JSON.stringify("From Store Locator Pdp"));

      router.push("/book-an-appointment");
    }
  };


  return (
    <div className={styles.contentWrapper}>
      <div className={styles.mapViewBtn}>
        {/* <SlidingRadioSwitch
          toggleLabel={"Map View"}
          onToggle={handleToggleChange}
          value ={activeToggle}
        /> */}
      </div>
      <div className={styles.content}>
        <Typography variant="h3" className={styles.title}>
          {store?.name}
        </Typography>
      </div>
      <div className={styles.locationInfo}>
        <div className={styles.leftSection}>
          <MapIcon className={styles.mapIcon} />
          <span className={styles.addressWrapper}>
            <Typography variant="p" className={styles.storeCity}>
              {store?.city}
            </Typography>
            <div className={styles.vline}>&nbsp;</div>
            <Typography variant="p" className={styles.storeAddress}>
              {store?.address1}
            </Typography>
          </span>
        </div>
        <span className={styles.directionBtnWrapper}>
          <a
            href={store?.c_googleMapLocation}
            target="_blank"
            className={`${styles.storeMapLink} button plain brown_dark`}
          >
            <span>Get Directions</span>
          </a>
        </span>
      </div>

      <div className={styles.storeImageWrapper}>
        {activeToggle ? (
          <div className={styles.mapContainer}>
            <MapView
                    nearestStore={""}
                    stores={stores}
                    activeStore={store}
                    userLocation={userLocation}
                    useOnPopup={true}
                    handleStoreClick={null}
                    swiperRef = {null}
                />
          </div>
        ) : (
          <div className={styles.imageContainer}>
            <img
              className={styles.storeImg}
              src={storeImage}
              alt={store?.name}
            />
          </div>
        )}
      </div>

      <div className={styles.storeContactWrapper}>
        <div className={styles.leftSection}>
          <WhatsappIcon className={styles.WhatsappIcon} strokeColor="#464f4a" />
          <span className={styles.contactLabelWrapper}>
            <Typography variant="p" className={styles.contactLabel}>
              {"Get in Touch"}
            </Typography>
          </span>
        </div>
        <span className={styles.contactWrapper}>
        <Button
          isLink={true}
          link={`tel:${store?.phone?.replace(/\s+/g, '')}`}
          title={"Call"}
          color={"brown_dark"}
          type={"plain"}
          className={styles.contactBtn}
        />
        <div className={styles.vDivider}>&nbsp;</div>
        <Button
          isLink={true}
          link={`https://wa.me/${store?.fax?.replace(/\s+/g, '')}`}
          className={styles.whatsappBtn}
          title={"WhatsApp"}
          color="brown_dark"
          type={"plain"}
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

      <hr className={styles.divider} />

      {store?.c_services && store.c_services.length > 0 ? (
                      <>
                        <div className={styles.serviceWrapper}>
                          <div className={styles.iconSection}>
                            <ServiceIcon className={styles.serviceIcon} />
                          </div>
                          <div className={styles.storeServiceInfo}>
                            <ul className={styles.serviceList}>
                              {store.c_services.map((service, index) => (
                                <li key={index}>{service}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.bookAppointment}>
                            {/* <Button
                              className={styles.bookAppointmentButton}
                              title="Book Appointment"
                              isLink={false}
                              link="/book-an-appointment"
                              type="Plain"
                              color="black_darK"
                              clickHandler={handleBookAppointment}
                            /> */}
                          </div>
                        </div>
                        <hr className={styles.divider} />
                      </>
                    ) : 
                      <>
                        <div className={styles.serviceWrapper}>
                          <div className={styles.iconSection}>
                            <ServiceIcon className={styles.serviceIcon} />
                          </div>
                          <div className={styles.storeServiceInfo}>
                            <ul className={styles.serviceList}>
                                <li>No services available</li>
                            </ul>
                          </div>
                          <div className={styles.bookAppointment}>
                            {/* <Button
                              className={styles.bookAppointmentButton}
                              title="Book Appointment"
                              isLink={false}
                              link="/book-an-appointment"
                              type="Plain"
                              color="black_darK"
                              clickHandler={handleBookAppointment}
                            /> */}
                          </div>
                        </div>
                        <hr className={styles.divider} />
                      </>
                    }

      <div className={styles.storeBrandsInfo}>
        <div className={styles.iconSection}>
          <BrandsIcon className={styles.brandsIcon} />
        </div>
        <span className={styles.availableBrandsLabel}>
          <Typography variant="p" className={styles.availableBrandsTitle}>
            {"Brands Available"}
          </Typography>
        </span>
        {store?.c_availableBrands?.length > 8 && (
          <span className={styles.viewAllBrands}>
            <Button
              isLink={false}
              className={styles.viewAllBrandsBtn}
              title={"View all brands"}
              color="brown_dark"
              type={"plain"}
              clickHandler={handleViewAllBrands}
            />
          </span>
        )}
      </div>

      <div className={styles.brandsWrapper}>
        {brandsToDisplay &&
          brandsToDisplay.map((availableBrand, index) => (
            <React.Fragment key={index}>
              <p className={styles.brandsName}>{availableBrand}</p>
              {index < brandsToDisplay.length - 1 && (
                <div className={styles.brandSeparator} />
              )}
            </React.Fragment>
          ))}
      </div>

      <hr className={styles.divider} />

      {/* All Brand Pop up */}
      {isAllBrandPopupOpen && (
        <BrandPopup
          brands={store?.c_availableBrands}
          onClose={handleClosePopup}
          isOpen={isAllBrandPopupOpen}
        />
      )}
    </div>
  );
};

export default StoreDetails;
