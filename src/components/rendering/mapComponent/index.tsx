import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./mapComponent.module.scss";

import UseFetchStores from "@utils/useCustomHooks/useFetchStores";
import { getDistance } from "@utils/helpers/getDistance";

import MapView from "@components/module/mapView";
import StoreMapListContainer from "@components/module/storeMapListContainer";
import { Typography } from "@components/module";

const MapComponent = (content) => {
  const [stores, setStores] = useState([]);

  const [userLocation, setUserLocation] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef(null);

  const fetchStores = async (location) => {
    try {
      let result;
      if (location) {
        result = await UseFetchStores(
          "",
          "",
          "",
          "",
          location.lat.toString(),
          location.lng.toString(),
          ""
        );
      } else {
        result = await UseFetchStores("", "", "", "", null, null, "");
      }
      setStores(result.response || []);
    } catch (error) {
      console.error("error---", error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          fetchStores(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          fetchStores(null);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else {
      console.log("Geolocation is not supported");
      fetchStores(null);
    }
  }, []);

  useEffect(() => {
    if (stores.length > 0 && userLocation) {
      const nearest = calculateNearestStore(stores, userLocation);
      setNearestStore(nearest);
    }
  }, [stores, userLocation]);

  const calculateNearestStore = (storesList, userLoc) => {
    if (!userLoc || storesList.length === 0) return null;

    const distances = storesList.map((store) => {
      return {
        store,
        distance: getDistance(
          { lat: userLoc.lat, lng: userLoc.lng },
          { lat: store.latitude, lng: store.longitude }
        ),
      };
    });

    const nearest = distances.reduce((prev, curr) =>
      prev.distance < curr.distance ? prev : curr
    );
    return nearest.store;
  };

  const handleStoreClick = (index) => {
    setActiveIndex(index);
  };

  const [itemsToShow, setItemsToShow] = useState(8);

  const allStores = useMemo(() => stores, [stores]);

  return (
    <div className={styles.mapWrapperClass}>
      <div className={styles.mapSection}>
        <MapView
          nearestStore={nearestStore}
          stores={allStores}
          activeStore={allStores[activeIndex]}
          userLocation={userLocation}
          useOnPopup={false}
          handleStoreClick={handleStoreClick}
          swiperRef={swiperRef}
          offset={-0.04}
        />
      </div>

      <div className={styles.listSection}>
        <Typography align="left" variant="p" className={styles.title}>
          {content?.title?.toUpperCase()}
        </Typography>
        <StoreMapListContainer
          storesList={allStores}
          activeIndex={activeIndex}
          handleStoreClick={handleStoreClick}
          isMobile={false}
          isAbsolutePosition={false}
          needScrollbar={true}
        />
      </div>
    </div>
  );
};

export default MapComponent;
