import React, { useEffect, useRef, useContext, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { LanguageContext } from "@contexts/languageContext";

const api_key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const MapView = ({ nearestStore, stores, activeStore, userLocation, useOnPopup, handleStoreClick, swiperRef, offset = 0, isPinCenter = false, showOnlyActiveStore = false }) => {
  const { language } = useContext(LanguageContext);
  const mapRef = useRef();
  const markersRef = useRef([]);
  const [isDesktop] = useDeviceWidth();

  const clearGoogleMapsScript = () => {
    const scripts = Array.from(document.getElementsByTagName("script"));
    scripts.forEach((script) => {
      if (script.src.includes("maps.googleapis.com")) {
        script.remove();
      }
    });
    delete window.google;
  };

  const loadGoogleMapsScript = (language) => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve(window.google);
        return;
      }

      const lang = language.includes("ar-") ? "ar" : "en";

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&language=${lang}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject("Google Maps not available after loading.");
        }
      };

      script.onerror = reject;

      document.head.appendChild(script);
    });
  };


  useEffect(() => {
    const styles = [
      {
          "featureType": "all",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#ffaa00"
              },
              {
                  "saturation": "-33"
              },
              {
                  "lightness": "10"
              }
          ]
      },
      {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#9c5e18"
              }
          ]
      },
      {
          "featureType": "landscape.natural.terrain",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.attraction",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.business",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.government",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.place_of_worship",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "labels.text",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "transit.line",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "saturation": "-23"
              },
              {
                  "gamma": "2.01"
              },
              {
                  "color": "#f2f6f6"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "saturation": "-14"
              }
          ]
      }
  ];

  clearGoogleMapsScript();

  loadGoogleMapsScript(language).then((google: typeof window.google) => {
    if (google && (nearestStore || activeStore)) {
      let latitude, longitude;

      if (activeStore) {
        latitude = (!isDesktop && offset !== 0) 
          ? activeStore.latitude + offset 
          : activeStore.latitude;
        longitude = activeStore.longitude;
      } else {
        latitude = (!isDesktop && offset !== 0) 
          ? nearestStore.latitude + offset 
          : nearestStore.latitude;
        longitude = nearestStore.longitude;
      }

      const map = new google.maps.Map(mapRef.current, {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 12,
        styles: styles
      });

      const getIconSize = () => {
        const width = window.innerWidth;
        return new google.maps.Size(width < 600 ? 41 : 55, width < 600 ? 54 : 73);
      };

      const nearestStoreIcon = {
        url: "/images/png/map-pin.png",
        scaledSize: getIconSize(),
      };

      const userLocationIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      };

      const storeIcon = {
        url: "/images/png/map-pin.png",
        scaledSize: getIconSize(),
      };

      /*if (nearestStore) {
        new google.maps.Marker({
          position: { lat: nearestStore.latitude, lng: nearestStore.longitude },
          map: map,
          title: nearestStore.name,
          icon: nearestStoreIcon,
        });
      }*/

      // Mark user's location
      if (userLocation && (nearestStore.latitude !== userLocation.lat || nearestStore.longitude !== userLocation.lng)) {
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: userLocationIcon,
        });
      }

      (!showOnlyActiveStore ? stores : activeStore ? [activeStore] : []).forEach((store, index) => {
        const scalingFactor = 0.5;
      
        const iconSize = store.id === activeStore?.id
          ? getIconSize()
          : new google.maps.Size(
              getIconSize().width * scalingFactor,
              getIconSize().height * scalingFactor 
            );
      
        const zIndex = store.id === activeStore?.id ? 100 : 1;
      
        const marker = new google.maps.Marker({
          position: { lat: store.latitude, lng: store.longitude },
          map: map,
          title: store.name,
          icon: {
            url: "/images/png/map-pin.png",
            scaledSize: iconSize,
          },
          zIndex: zIndex
        });
      
        markersRef.current.push(marker);
      
        if (!showOnlyActiveStore) {
          marker.addListener("click", () => {
            handleStoreClick(index);
      
            if (swiperRef.current && swiperRef.current.swiper) {
              swiperRef.current.swiper.slideTo(index);
            }
          });
        }
      });

      // Optionally, set up any specific logic for the activeStore here
      if (activeStore && isDesktop && useOnPopup === false) {
        const currentCenter = map.getCenter();
        let lng;

        if (isPinCenter) {
          lng = language.toLowerCase().includes("en-") ? currentCenter.lng() : currentCenter.lng()
        } else {
          lng = language.toLowerCase().includes("en-") ? currentCenter.lng() + -0.01 : currentCenter.lng() + 0.01
        }

        map.panTo({
          lat: currentCenter.lat(),
          lng: lng,
        });
        map.setZoom(15);
      }
    }
  }).catch(err => {
    console.error("Error loading Google Maps: ", err);
  });

}, [nearestStore, stores, activeStore, isDesktop, handleStoreClick, swiperRef]);

return <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>;
};

export default MapView;
