import React, { useEffect, useRef, useState } from "react";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { PlusColored, MinusColored } from "@assets/images/svg";
import styles from "./rolexMapView.module.scss";
import { mapStyles } from "@utils/data/mapStyles";

const api_key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const RolexMapView = ({
  nearestStore,
  stores,
  activeStore,
  userLocation,
  useOnPopup,
  handleStoreClick,
  swiperRef,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isDesktop] = useDeviceWidth();

  const clearGoogleMapsScript = () => {
    Array.from(document.getElementsByTagName("script"))
      .filter((s) => s.src.includes("maps.googleapis.com"))
      .forEach((s) => s.remove());
    delete window.google;
  };

  const loadGoogleMapsScript = () =>
    new Promise<any>((resolve, reject) => {
      if (window.google?.maps) return resolve(window.google);

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () =>
        window.google?.maps
          ? resolve(window.google)
          : reject("Google Maps not available");
      script.onerror = reject;

      document.head.appendChild(script);
    });

  useEffect(() => {
    clearGoogleMapsScript();


    loadGoogleMapsScript()
      .then((google: any) => {
        if (!google || !(nearestStore || activeStore)) return;

        const map = new google.maps.Map(mapRef.current, {
          center: {
            lat: activeStore ? activeStore.latitude : nearestStore.latitude,
            lng: activeStore ? activeStore.longitude : nearestStore.longitude,
          },
          zoom: 12,
          styles: mapStyles,
          fullscreenControl: false,
        });
        setMapInstance(map);

        const getIconSize = () => new google.maps.Size(27, 29);
        const getIcon = (isActive: boolean) => ({
          url: isActive
            ? "/images/png/rolex_map_Pin_active.png"
            : "/images/png/rolex_map_Pin.png",
          scaledSize: getIconSize(),
        });

        if (
          userLocation &&
          (nearestStore.latitude !== userLocation.lat ||
            nearestStore.longitude !== userLocation.lng)
        ) {
          new google.maps.Marker({
            position: userLocation,
            map,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          });
        }

        stores.forEach((store: any, idx: number) => {
          const isActive = store.id === activeStore?.id;

          const marker = new google.maps.Marker({
            position: { lat: store.latitude, lng: store.longitude },
            map,
            icon: getIcon(isActive),
            zIndex: isActive ? 100 : 1,
          });

          marker.addListener("click", () => {
            handleStoreClick(idx, store);
            if (swiperRef.current?.swiper)
              swiperRef.current.swiper.slideTo(idx);
          });

          marker.addListener("mouseover", () => marker.setIcon(getIcon(true)));
          marker.addListener(
            "mouseout",
            () => !isActive && marker.setIcon(getIcon(false))
          );

          markersRef.current.push(marker);
        });

        if (activeStore && isDesktop && useOnPopup === false) {
          const c = map.getCenter();
          map.panTo({ lat: c.lat(), lng: c.lng() - 0.01 });
          map.setZoom(15);
        }
      })
      .catch((err) => console.error("Google Maps load error:", err));

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      clearGoogleMapsScript();
      setMapInstance(null);
    };
  }, [
    nearestStore,
    stores,
    activeStore,
    userLocation,
    isDesktop,
    handleStoreClick,
    swiperRef,
  ]);

  const zoomIn = () =>
    mapInstance && mapInstance.setZoom(mapInstance.getZoom() + 1);
  const zoomOut = () =>
    mapInstance && mapInstance.setZoom(mapInstance.getZoom() - 1);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapRef} className={styles.mapCanvas} />

      <div className={styles.zoomControls}>
        <button onClick={zoomIn} className={styles.zoomButton}>
          <PlusColored />
        </button>
        <button onClick={zoomOut} className={styles.zoomButton}>
          <MinusColored />
        </button>
      </div>
    </div>
  );
};

export default RolexMapView;
