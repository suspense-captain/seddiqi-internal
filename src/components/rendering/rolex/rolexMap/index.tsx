import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./rolexMap.module.scss";

import UseFetchStores from "@utils/useCustomHooks/useFetchStores";
import { getDistance } from "@utils/helpers/getDistance";
import { RolexMapView } from "@components/module";
import { Typography } from "@components/module";
import { useRouter } from "next/router";
import { LanguageContext } from "@contexts/languageContext";

import {
  CloseIcon,
  RolexMapPoint,
  RolexPhone,
  RolexPlus,
} from "@assets/images/svg";

const RolexMap = (content: any) => {
  const { backgroundColor } = content;

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const [nearestStore, setNearestStore] = useState(null);

  const [selectedStore, setSelectedStore] = useState(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");

  const swiperRef = useRef(null);
  const activeStore = activeIndex !== null ? stores[activeIndex] : null;

  const router = useRouter();
  const isCPOPage = router.asPath.toLowerCase().includes("cpo");

  const { language } = useContext(LanguageContext);

  const fetchStores = async (location: { lat: number; lng: number } | null) => {
    try {
      const res = await UseFetchStores(
        "",
        "",
        "",
        "",
        location ? location.lat.toString() : null,
        location ? location.lng.toString() : null
      );

      const filterStoresByBrand = (stores: any[], brandName: string) =>
        stores?.filter(
          (s) =>
            Array.isArray(s.c_availableBrands) &&
            s.c_availableBrands.some(
              (brand: string) => brand.toLowerCase() === brandName.toLowerCase()
            )
        ) || [];

      const rolexOnly = filterStoresByBrand(res?.response, "rolex");
      const rcpoOnly = filterStoresByBrand(res?.response, "rolex certified pre-owned");

      if(isCPOPage){
        setStores(rcpoOnly);
      }
      else{
        setStores(rolexOnly);
      }
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationFetched) return;
    if (!navigator.geolocation) {
      fetchStores(null);
      setLocationFetched(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(loc);
        fetchStores(loc);
      },
      () => fetchStores(null),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  }, [locationFetched]);

  useEffect(() => {
    if (!stores.length || !userLocation) return;
    const nearest = stores
      .map((s) => ({
        s,
        d: getDistance(userLocation, { lat: s.latitude, lng: s.longitude }),
      }))
      .reduce((p, c) => (p.d < c.d ? p : c)).s;
    setNearestStore(nearest);
  }, [stores, userLocation]);

  const handleStoreClick = (i: number, store: any) => {
    setActiveIndex(i);  
    setSelectedStore(store);
    setPanelOpen(true);
    setViewMode("map");
  };

  const handleStoreDetails = (storeId, showMapView = false) => {
    router.push({
      pathname: isCPOPage ? `/${language}/rolex-cpo/contact-us/${storeId}` : `/${language}/rolex/contact-us/${storeId}`,
      query: {
        mapView: showMapView ? 'true' : 'false',
        isCPOPage: isCPOPage ? 'true' : 'false',
      },
    });
  };

  const handleClose = () => {
    setPanelOpen(false);
    setActiveIndex(null);      
    setTimeout(() => setSelectedStore(null), 300);
  };

  const switchToMap = () => setViewMode("map");
  const switchToList = () => {
    setPanelOpen(false);
    setSelectedStore(null);
    setViewMode("list");
  };

  const formatTel = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;
  // console.log("stores---", stores);

  const getGoogleMapsDirectionUrl = (store: any) => {
    const userPath = userLocation
      ? `&origin=${userLocation.lat},${userLocation.lng}`
      : "";
    const mapPath = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}${userPath}`;
    return mapPath;
  };

  return (
    <div
      className={`${styles.rolexMapContainer} ${
        backgroundColor ? styles[backgroundColor] ?? "" : ""
      }`}
    >
      <div className={styles.rolexMapWrapper}>
        <div
          className={`${styles.toggleContainer} ${
            viewMode === "list" ? styles.inList : styles.inMap
          }`}
        >
          <div onClick={switchToList}>
            <Typography
              variant="p"
              className={`${styles.toggleButton} ${
                viewMode === "list" ? styles.active : ""
              }`}
            >
              List
            </Typography>
          </div>
          <div onClick={switchToMap}>
            <Typography
              variant="p"
              className={`${styles.toggleButton} ${
                viewMode === "map" ? styles.active : ""
              }`}
            >
              Map
            </Typography>
          </div>
        </div>

        <div className={styles.mapArea}>
          {viewMode === "map" && (
            <div className={styles.mapContainer}>
              {!loading && stores.length > 0 && (
                <RolexMapView
                  nearestStore={nearestStore}
                  stores={stores}
                  activeStore={activeStore}  
                  userLocation={userLocation}
                  useOnPopup={false}
                  handleStoreClick={handleStoreClick}
                  swiperRef={swiperRef}
                />
              )}
            </div>
          )}

          {viewMode === "list" && (
            <div className={styles.listWrapper}>
              {stores.map((store, i) => (
                <div className={styles.storeCard} key={store.id ?? i}>
                  <Typography variant="h4" className={styles.cardTitle}>
                    {store.name}
                  </Typography>
                  {store.address1 && (
                    <Typography variant="p" className={styles.cardAddress}>
                      {store.address1}
                    </Typography>
                  )}
                  <div className={styles.cardIcons}>
                    {store.phone && (
                      <Link
                        href={formatTel(store.phone)}
                        legacyBehavior
                        passHref
                      >
                        <a className={styles.cardIcon}>
                          <RolexPhone />
                        </a>
                      </Link>
                    )}
                    {store.c_googleMapLocation && store?.latitude && store?.longitude && (
                      <Link
                        href={getGoogleMapsDirectionUrl(store)}
                        target="_blank"
                        rel="noopener noreferrer"
                        legacyBehavior
                        passHref
                      >
                        <a target="_blank" className={styles.cardIcon}>
                          <RolexMapPoint />
                        </a>
                      </Link>
                    )}
                    {store.c_storeWebsite && (
                      <a
                        className={styles.cardIcon}
                        onClick={(e) => {
                          e.preventDefault();
                          handleStoreDetails(store.id, true);
                        }}
                      >
                        <RolexPlus />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedStore && (
            <div
              className={`${styles.sideContainer} ${
                panelOpen ? styles.open : styles.close
              }`}
            >
              {selectedStore?.c_storeImage && (
                <div className={styles.localtionImage}>
                  <img
                    src={selectedStore?.c_storeImage}
                    alt="Rolex Store"
                    width="400"
                    height="256"
                  />
                </div>
              )}

              <button className={styles.closeButton} onClick={handleClose}>
                <CloseIcon />
              </button>

              <div className={styles.storeDetails}>
                <Typography variant="p" className={styles.storeTitle}>
                  {selectedStore.name}
                </Typography>

                {selectedStore.address1 && (
                  <Typography variant="p" className={styles.address}>
                    {selectedStore.address1}
                  </Typography>
                )}

                {selectedStore.phone && (
                  <Link
                    href={formatTel(selectedStore.phone)}
                    legacyBehavior
                    passHref
                  >
                    <a className={styles.infoRow}>
                      <span className={styles.iconCircle}>
                        <RolexPhone />
                      </span>
                      <Typography variant="p" className={styles.inforDetails}>
                        {selectedStore.phone}
                      </Typography>
                    </a>
                  </Link>
                )}

                {selectedStore.c_googleMapLocation && (
                  <Link
                    href={getGoogleMapsDirectionUrl(selectedStore)}                    target="_blank"
                    rel="noopener noreferrer"
                    legacyBehavior
                    passHref
                  >
                    <a target="_blank" className={styles.infoRow}>
                      <span className={styles.iconCircle}>
                        <RolexMapPoint />
                      </span>
                      <Typography variant="p" className={styles.inforDetails}>
                        Get Directions
                      </Typography>
                    </a>
                  </Link>
                )}

                {/* HIDDEN FOR NOW */}
                {selectedStore.c_storeWebsite && (
                  <a
                    className={styles.infoRow}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStoreDetails(selectedStore.id, true);
                    }}
                  >
                    <span className={styles.iconCircle}>
                      <RolexPlus />
                    </span>
                    <Typography variant="p" className={styles.inforDetails}>
                      More Details
                    </Typography>
                  </a>
                )}

                <div className={styles.mobileIconRow}>
                  {selectedStore.phone && (
                    <Link
                      href={formatTel(selectedStore.phone)}
                      legacyBehavior
                      passHref
                    >
                      <a>
                        <RolexPhone />
                      </a>
                    </Link>
                  )}
                  {selectedStore.c_googleMapLocation && (
                    <Link
                      href={getGoogleMapsDirectionUrl(selectedStore)}
                      target="_blank"
                      rel="noopener noreferrer"
                      legacyBehavior
                      passHref
                    >
                      <a target="_blank">
                        <RolexMapPoint />
                      </a>
                    </Link>
                  )}
                  {selectedStore.c_storeWebsite && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleStoreDetails(selectedStore.id, true);
                      }}
                    >
                      <RolexPlus />
                    </a>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolexMap;
