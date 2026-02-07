import React, { useEffect, useState } from "react";
import styles from "./storeLocator.module.scss";
import UseFetchStores from "@utils/useCustomHooks/useFetchStores";
import MapView from "@components/module/mapView";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { LocationIcon } from "@assets/images/svg";
import StoreMapListContainer from "@components/module/storeMapListContainer";
import LocationTabs from "@components/module/locationTabs";
import { getDistance } from "@utils/helpers/getDistance";
import ToggleMapResults from "@components/module/toggleMapResults";
import { useRouter } from 'next/router';
import { Loader, StoreLocationDetails } from "@components/module";
import { useContext } from "react";
import { LanguageContext } from "@contexts/languageContext";

const StoreLocator = ({ productImgAlt, productImgSrc, productBrand, productName, productPrice, productCurrency, productStoreIds }) => {
  const { language, country, handleCountryChange } = useContext(LanguageContext);

  // useEffect(() => {
  //   if (handleCountryChange && country.toLowerCase() !== "sa") {
  //     handleCountryChange("sa");
  //   }
  // }, []);
  
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);
  const [locationStores, setLocationStores] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeToggle, setActiveToggle] = useState(false);
  const [fadeList, setFadeList] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8);
  //const [activeTab, setActiveTab] = useState('All');
  const [activeTab, setActiveTab] = useState(language.toLowerCase().includes("-sa") ? 'KSA' : 'Dubai'); //Remove this line and uncomment the code above this once other brands are available
  const [cities, setCities] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [mapViewOn, setMapViewOn] = useState(false);

  useEffect(() => {
    if (language.toLowerCase().includes("-sa")) {
      setActiveTab('KSA');
    } else {
      setActiveTab('Dubai');
    }
  }, [language]);
  
  const tabs =
    language.toLowerCase().includes("-sa")
      ? [
          { label: 'All Boutiques', value: 'All' },
          { label: 'KSA', value: 'KSA' },
          { label: 'Dubai', value: 'Dubai' },
          { label: 'Abu Dhabi', value: 'Abu Dhabi' }
        ]
      : [
          // { label: 'All Boutiques', value: 'All' },
          { label: 'Dubai', value: 'Dubai' },
          // { label: 'Abu Dhabi', value: 'Abu Dhabi' },
        ];

  const handleStoreDtetails = (store) => {
    setSelectedStoreId(store.id);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedStoreId(null);
  };

  const handleStoreClick = (index) => {
    setActiveIndex(index); // Set the clicked store as active
  };

  const [isMobile] = useDeviceWidth();

  const defaultLocations = {
    KSA: { lat: 24.7136, lng: 46.6753 },
    Dubai: { lat: 25.2048, lng: 55.2708 } 
  };

  const fetchStores = async (location) => {
    try {
      let result;
  
      // Determine the default location based on language
      const countryCode = language?.toLowerCase().includes("-sa") ? "KSA" : "Dubai";
      const usedLocation = location || defaultLocations[countryCode] || defaultLocations.Dubai;
  
      // Fetching stores using brand name
      function capitalizeWords(string) {
        if (!string) return string;
        return string
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
  
      let capitalResult = capitalizeWords(productBrand);
  
      if(capitalResult === "Rolex Certified Pre-owned"){
        capitalResult = "Rolex Certified Pre-Owned"; 
      }
  
      if (productStoreIds) {
        result = await UseFetchStores(
          '', '', '', '', 
          usedLocation.lat, usedLocation.lng, 
          productStoreIds, language
        );
      } else {
        result = await UseFetchStores(
          capitalResult, '', '', '', 
          usedLocation.lat, usedLocation.lng, 
          '', language
        );
      }
  
      setStores(result.response);
  
      // Filter stores based on city & language
      const filteredStores = language.toLowerCase().includes("-sa") 
        ? result.response.filter(store => ["KSA","Dubai","Abu Dhabi"].includes(store.city))
        : result.response.filter(store => ["Dubai","Abu Dhabi"].includes(store.city));
  
      setLocationStores(filteredStores);
  
      const uniqueCities = [...new Set(result.response.map(store => store.city))];
      setCities(uniqueCities);
  
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location); 
          fetchStores(location);
        },
        (error) => {
          console.error("Error watching location:", error);
          setUserLocation(null);
          fetchStores(null); // Default location will be used inside fetchStores
        },
        {
          enableHighAccuracy: true, 
          maximumAge: 0, 
          timeout: 5000, 
        }
      );
  
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
      fetchStores(null);
    }
  }, [language]);

  useEffect(() => {
    if (stores.length > 0 && userLocation) {
      const nearest = calculateNearestStore(stores);
      setNearestStore(nearest);
    }
  }, [stores, userLocation]);

  const calculateNearestStore = (storesList) => {
    if (!userLocation || storesList.length === 0) return null;

    const distances = storesList.map(store => {
      const storeLocation = { lat: store.latitude, lng: store.longitude };
      return {
        store,
        distance: getDistance(userLocation, storeLocation)
      };
    });

    return distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr)).store;
  };

  const handleTabChange = (tab) => {
    setFadeList(true);
    setTimeout(() => {
      setActiveTab(tab);
      setItemsToShow(8);
      setFadeList(false);

      const storesToCalculate = tab === 'All' ? stores : stores.filter(store => store.city === tab);

      //Used to pass the current tab stores to the map
      setLocationStores(storesToCalculate);

      const nearest = calculateNearestStore(storesToCalculate);
      setNearestStore(nearest);
    }, 300);
  };

  const handleToggleChange = (toggle) => {
    setFadeList(true);
    setMapViewOn(toggle); 
    setTimeout(() => {
      setActiveToggle(toggle);
      setFadeList(false);
    }, 300);
  };

  const renderStores = (storesList) => {
    const displayedStores = storesList.slice(0, itemsToShow);

    const sortedStoreList = [...displayedStores].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return (
      <>
        <ul className={styles.storeList}>
        {sortedStoreList.map(store => (
          <li className={styles.store} key={store.id} onClick={() => handleStoreDtetails(store)}>
            <div className={styles.storeImageContainer}>
              <img src={store.c_storeImage} alt={store.name} className={styles.storeImage} />

              {/* {activeToggle ? (
                  <>
                    {nearestStore && nearestStore.id === store.id && (
                      <h3 className={styles.nearestStore}>Nearest Store</h3>
                    )}
                  </>
                ) : null} */}
            </div>

            <div className={styles.storeDetails}>
              <h4 className={styles.storeName}>{store.name}</h4>

              <div className={styles.storeLocation}>
                <LocationIcon />

                <p><span>{store.city}</span><span>{store.address1}</span></p>
              </div>
            </div>
          </li>
        ))}
        </ul>
      </>
    );
  };

  const renderMaps = (storesList) => {
    if (storesList.length === 0) return null;

    const sortedLocationStores = [...locationStores].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    const sortedStoreList = [...storesList].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    const sortedNearestStores = [...storesList].sort((a, b) => {
      const distanceA = a.distance || Infinity; // Ensure a fallback if distance is not available
      const distanceB = b.distance || Infinity;
      return distanceA - distanceB; // Ascending order: nearest first
    });

    return (
      <>
        <div className={styles.mapContainer}>
        {nearestStore && userLocation && (
          <MapView 
            nearestStore={nearestStore} 
            stores={sortedNearestStores} 
            activeStore={sortedNearestStores[activeIndex]} 
            userLocation={userLocation} 
            useOnPopup={true}
            handleStoreClick={handleStoreClick}
            swiperRef = {null}
          />
        )}
        {!userLocation && (
          <MapView 
            nearestStore={null} 
            stores={sortedStoreList} 
            activeStore={sortedStoreList[activeIndex]} 
            userLocation={null} 
            useOnPopup={true}
            handleStoreClick={handleStoreClick}
            swiperRef = {null}
          />
        )}
        </div>
        
        {nearestStore && userLocation && (
          <div className={styles.storeMapListWrapper}>
            <StoreMapListContainer 
              storesList={sortedNearestStores} 
              activeIndex={activeIndex} 
              handleStoreClick={handleStoreClick} 
              isMobile={isMobile} 
              isAbsolutePosition={false}
              needScrollbar={false} //For Desktop Only
              useOnPopup={true}
              brandName={productBrand}
            />
          </div>
        )}
        {!userLocation && (
          <div className={styles.storeMapListWrapper}>
            <StoreMapListContainer 
              storesList={sortedStoreList} 
              activeIndex={activeIndex} 
              handleStoreClick={handleStoreClick} 
              isMobile={isMobile} 
              isAbsolutePosition={false}
              needScrollbar={false} //For Desktop Only
              useOnPopup={true}
              brandName={productBrand}
            />
          </div>
        )}
        
      </>
    );
  };

  //const combinedStores = stores;
  let combinedStores;
  if (language.toLowerCase().includes("-sa")) {
    combinedStores = stores.filter(store => 
      store.city.toLowerCase() === 'ksa' || store.city.toLowerCase() === 'dubai' || store.city.toLowerCase() === 'abu dhabi'
    );
  } else {
    combinedStores = stores.filter(store => 
      store.city.toLowerCase() === 'dubai' || store.city.toLowerCase() === 'abu dhabi'
    );
  }

  const storeCounts = {
    All: combinedStores.length,
    ...Object.fromEntries(cities.map(city => [city, stores.filter(store => store.city === city).length])),
  };

  return (
    <>
      {loading ? (
        <Loader /> // Show loader if data is still loading
      ) : (
        <>
        {!isDetailsOpen &&(
        <div className={styles.storeLocatorContainer}>
          <div className={styles.productInfoContainer}>
            <div className={styles.productInfoContainerImage}>
              <img alt={productImgAlt} src={productImgSrc} />
            </div>
            <div className={styles.productInfoContainerTexts}>
              <h6>{productBrand}</h6>
              <p>{productName}</p>
              {/*<span>{productCurrency} {productPrice}</span>*/}
            </div>
          </div>
          <LocationTabs activeTab={activeTab} handleTabChange={handleTabChange} tabs={tabs} />
          <ToggleMapResults 
            onToggle={handleToggleChange} 
            activeTab={activeTab} 
            storeCounts={storeCounts} 
          />

          <div className={`${styles.storeListContainer} ${fadeList ? styles.fadeOut : styles.fadeIn}`}>
              {activeToggle ? 
                renderStores(activeTab === 'All' ? combinedStores : stores.filter(store => store.city === activeTab)) : 
                renderMaps(activeTab === 'All' ? combinedStores : stores.filter(store => store.city === activeTab))
              }
          </div>
        </div>)}
        {isDetailsOpen &&
        (<StoreLocationDetails
            storeId={selectedStoreId}
            isOpen={isDetailsOpen}
            onClose={handleCloseDetails}
            mapViewOn={mapViewOn}
            useOnPopup={true}
            stores={stores}
            brandName={productBrand}
        />)
        }
        </>
      )}
    </>
  );
};

export default StoreLocator;