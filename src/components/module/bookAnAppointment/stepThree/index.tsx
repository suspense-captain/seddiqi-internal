import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import styles from "./index.module.scss";
import { Image, Loader } from "@components/module";
import { CloseIcon, MapIcon } from "@assets/images/svg";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import { Button } from "@components/module";
import MapView from "@components/module/mapView";
import { getDistance } from "@utils/helpers/getDistance";
import SelectedBrands from "../selectedBrands";
import { useRouter } from "next/router";
import UseFetchStores from "@utils/useCustomHooks/useFetchStores";
import { useDeviceWidth } from "@utils/useCustomHooks";
import BookAnAppointmentStoreMapList from "../bookAnAppointmentStoreMapList";
import BookAnAppointmentLocationTabs from "../bookAnAppointmentLocationTabs";
import BookAnAppointmentMapView from "@components/module/mapView";
import ToggleMapResults from "@components/module/toggleMapResults";

const StepThree = () => {
  const { 
    handleStepChange, 
    selectedCard, 
    setSelectedCard, 
    setSelectedStore, 
    updateStep,
    isPreviousStepEdited,
    setIsPreviousStepEdited,
    stores,
    setStores,
    cities,
    setCities,
    stepsContent,
    selectedWatches,
    selectedJewellery
  } = useContext(BookAppointmentContext);

  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const [nearestStore, setNearestStore] = useState(null);
  const [locationStores, setLocationStores] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeToggle, setActiveToggle] = useState(false); //Set to true to show the location lister
  const [fadeList, setFadeList] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const swiperRef = useRef(null);

  const tabs = [
    { label: 'All Boutiques', value: 'All' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'Abu Dhabi', value: 'Abu Dhabi' },
  ];

  const handleStoreClick = (index) => {
    setActiveIndex(index); // Set the clicked store as active
  };

  const [isMobile] = useDeviceWidth();

  const fetchStores = async (location) => {
    try {
      //const result = await UseFetchStores('', '', '', '');
      let result;

      if (location) {
        result = await UseFetchStores(selectedWatches.length > 0 ? selectedWatches : '', '', '', '', location.lat.toString(), location.lng.toString(), "");  // Pass lat and lng to fetch stores
      } else {
        result = await UseFetchStores(selectedWatches.length > 0 ? selectedWatches : '', '', '', '', null, null, ""); // Default fetch if no location is available
      }

      setStores(result.response);

      const filteredStores = result.response.filter(store =>
        store.city === 'Dubai' || store.city === 'Abu Dhabi'
      );

      setLocationStores(filteredStores);

      // Extract unique cities
      const uniqueCities = [...new Set(result.response.map(store => store.city))];
      setCities(uniqueCities);

      const filteredCity = result.response.filter(store => 
        store.city === 'Dubai' || store.city === 'Abu Dhabi'
      );

      const filteredAddresses = result.response
      .filter(store => store.city === 'Dubai' || store.city === 'Abu Dhabi')
      .map(store => store.name);
      
      //localStorage.removeItem("previousPage");
      
    } catch (error) {
      console.error(error);
      router.push("/500")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This function gets the user's geolocation
    const getLocation = () => {
      if (navigator.geolocation) {
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
            setUserLocation(null);
            fetchStores(null);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        )
      } else {
        console.log("Geolocation is not supported by this browser.");
        setLocationFetched(true); // Mark location fetching as complete for unsupported browsers
      }
    };

    // Fetch the user's location once on initial mount
    if (!locationFetched) {
      getLocation();
    }
  }, [locationFetched]);

  const handleSelectBoutique = () => {
    const selectedStore = nearestStore && userLocation ? sortedNearestStores[activeIndex] : sortedStoreList[activeIndex]; //stores.find((store) => store.id === selectedStoreId);

    if (selectedStore) {
      localStorage.setItem("selectedStore", JSON.stringify(selectedStore));
      setSelectedStore(selectedStore);
      updateStep(3, true);
      handleStepChange(4);
      setIsPreviousStepEdited(false);
    }
  };

  // const handleMapViewToggle = () => {
  //   if (selectedStoreId) {
  //     setIsMapView(!isMapView);
  //   }
  // };

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

    if (tab !== activeTab) {
      setFadeList(true);
      setTimeout(() => {
        setActiveTab(tab);
        setFadeList(false);
        setActiveIndex(0); //Set the active index to the first one on the list

        const storesToCalculate = tab === 'All' ? stores : stores.filter(store => store.city === tab);

        //Used to pass the current tab stores to the map
        setLocationStores(storesToCalculate);

        const nearest = calculateNearestStore(storesToCalculate);
        setNearestStore(nearest);
      }, 300);
    }
  };

  //const combinedStores = stores;
  const combinedStores = stores.filter(store => 
    store.city.toLowerCase() === 'dubai' || store.city.toLowerCase() === 'abu dhabi'
  );

  const calculateStoreCounts = (storesList) => {
    const combinedStores = storesList.filter(store => 
      store.city.toLowerCase() === 'dubai' || store.city.toLowerCase() === 'abu dhabi'
    );
  
    return {
      All: combinedStores.length,
      ...Object.fromEntries(cities.map(city => [city, combinedStores.filter(store => store.city === city).length])),
    };
  };

  const [storeCounts, setStoreCounts] = useState(stores.length); //useState(calculateStoreCounts(stores));
  
  // Update store counts whenever filters change
  useEffect(() => {
    setStoreCounts(calculateStoreCounts(getFilteredStores));
  }, [activeTab, stores]);

  const sortedLocationStores = useMemo(() => {
    return [...locationStores].sort((a, b) => a.name.localeCompare(b.name));
  }, [locationStores]);

  const sortedStoreList = useMemo(() => {
    return [...stores].sort((a, b) => a.name.localeCompare(b.name));
  }, [stores]);

  const sortedNearestStores = useMemo(() => {
    return [...locationStores].sort((a, b) => {
      const distanceA = a.distance || Infinity;
      const distanceB = b.distance || Infinity;
      return distanceA - distanceB;
    });
  }, [locationStores]);

  const getFilteredStores = useMemo(() => {
    let filteredStores = stores;

    if (activeTab === 'All') {
      filteredStores = filteredStores.filter(store =>
        store.city === 'Dubai' || store.city === 'Abu Dhabi'
      );
    } else {
      filteredStores = filteredStores.filter(store => store.city === activeTab);
    }

    return filteredStores;
  }, [stores, activeTab]);

  const renderMaps = (storesList) => {
    const sortedStores = storesList.length === 0 ? [] : storesList;

    if (sortedStores.length === 0) {
      return <div className={styles.noLocationsMessage}>No locations available for this selection.</div>;
    }

    return (
      <>
        {nearestStore && userLocation && (
        <BookAnAppointmentStoreMapList 
          storesList={sortedNearestStores} 
          activeIndex={activeIndex} 
          handleStoreClick={handleStoreClick}
          isMobile={!isMobile} 
          isAbsolutePosition={true}
          needScrollbar={true} //For Desktop Only
        />
        )}
        {!userLocation && (
        <BookAnAppointmentStoreMapList 
          storesList={sortedStoreList} 
          activeIndex={activeIndex} 
          handleStoreClick={handleStoreClick}
          isMobile={!isMobile} 
          isAbsolutePosition={true}
          needScrollbar={true} //For Desktop Only
        />
        )}

        <div className={styles.mapContainer}>
        {nearestStore && userLocation && (
          <BookAnAppointmentMapView 
            nearestStore={nearestStore} 
            stores={sortedNearestStores} 
            activeStore={sortedNearestStores[activeIndex]} 
            userLocation={userLocation} 
            useOnPopup={false}
            handleStoreClick={handleStoreClick}
            swiperRef = {swiperRef}
          />
        )}
        {!userLocation && (
          <MapView 
            nearestStore={null} 
            stores={sortedStoreList} 
            activeStore={sortedLocationStores[activeIndex]}
            userLocation={null} 
            useOnPopup={false}
            handleStoreClick={handleStoreClick}
            swiperRef = {swiperRef}
          />
        )}
        </div>
      </>
    );
  };

  const renderTabContent = () => {
    const filteredStores = getFilteredStores;
    
    if (filteredStores.length === 0) {
      return <div className={styles.noLocationsMessage}>No locations available for this selection.</div>;
    }
  
    return renderMaps(filteredStores);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.selectedData}>
          <div className={styles.serviceCard}>
            <Image
              className={`${styles.serviceImg} ${styles.serviceImage}`}
              image={selectedCard?.media?.image}
              imageAltText={selectedCard?.media?.altText}
            />
            <div className={styles.serviceInfo}>
              <div className={styles.serviceTitle}>{selectedCard?.title}</div>
              <div className={styles.serviceDesc}>{selectedCard?.description}</div>
            </div>
            <div
              onClick={() => {
                handleStepChange(1);
                setSelectedCard(null);
                updateStep(1, false);
              }}
            >
              <CloseIcon className={styles.closeIcon} />
            </div>
          </div>
          <SelectedBrands />
        </div>
        
        {
          isLoading ? (
            <Loader localContainerLoading={true} />
          ) : (
            <>
            <BookAnAppointmentLocationTabs
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              tabs={tabs}
            />

            <div className={styles.toggleContainer}>
              <ToggleMapResults
                onToggle={null}
                activeTab={activeTab}
                storeCounts={storeCounts}
              />
            </div>

            <div className={styles.mapViewContainer}>
            {
              renderTabContent()
            }
            </div>
            </>
          )
        }

        
      
      </div>
      <div className={styles.appointmentBtn}>
        <Button 
          title={isPreviousStepEdited ? stepsContent.other.returnButtonText : stepsContent.third.buttonText}
          disabled={isLoading} 
          color="metallic" 
          type="solid" 
          clickHandler={handleSelectBoutique} 
        />
      </div>
    </div>
  );
};

export default StepThree;
