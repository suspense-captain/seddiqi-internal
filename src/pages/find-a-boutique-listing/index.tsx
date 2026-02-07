import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./findABotiqueListing.module.scss";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import compact from "lodash/compact";
import Layout from "@components/layout";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import ContentBlock from "@components/module/contentBlock";
import UseFetchStores from "@utils/useCustomHooks/useFetchStores";
import MapView from "@components/module/mapView";
import { useDebounce, useDeviceWidth } from "@utils/useCustomHooks";
import { CloseIcon, FilterIcon, LocationIcon, SearchIcon } from "@assets/images/svg";
import StoreMapListContainer from "@components/module/storeMapListContainer";
import LocationTabs from "@components/module/locationTabs";
import { getDistance } from "@utils/helpers/getDistance";
import ToggleMapResults from "@components/module/toggleMapResults";

import "swiper/css";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { Loader, SideDrawer, Typography } from "@components/module";
import { FilterAccordian, FilterAccordionItem } from "@components/module/filterAccordian";
import CheckboxFilter from "@components/module/checkboxFilter";
import SearchIcon2 from "@assets/images/svg/SearchIcon2";
import { useRouter } from 'next/router';
import { HeroBanner } from "@components/rendering";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";

import { useContext } from "react";
import { LanguageContext } from "@contexts/languageContext";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}find-a-boutique-listing` },
      },
    },
    context
  );

  const navigations = (data.hierarchies as any).pages.filter(item => item !== null)

  if (navigations.length === 0) {
    if (isKSALocale(context?.locale)) {
      return {
        redirect: {
          destination: '/en-sa',
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      ...data
    },
  };
}
export default function FindABoutiqueListing({ content }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { language } = useContext(LanguageContext);
  const texts = findABoutiqueListingStaticData[language]

  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const [nearestStore, setNearestStore] = useState(null);
  const [locationStores, setLocationStores] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeToggle, setActiveToggle] = useState(false); //Set to true to show the location lister
  const [fadeList, setFadeList] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8);
  const [activeTab, setActiveTab] = useState(language.toLowerCase().includes("-sa") ? "KSA" : "All");
  const [cities, setCities] = useState([]);
  const [filtersPopup, showFiltersPopup] = useState(false);
  const [locationCheckboxValues, setLocationCheckboxValues] = useState([]);
  const [brandCheckboxValues, setBrandCheckboxValues] = useState([]);
  const [serviceCheckboxValues, setServiceCheckboxValues] = useState([]);
  const [openAccordion, setOpenAccordion] = useState("brands"); // Default open accordion
  const [filterApplied, setFilterApplied] = useState(false);
  const [filteredStores, setFilteredStores] = useState([]);
  const [brandsSearchQuery, setBrandsSearchQuery] = useState('');
  const [filters, setFiltersState] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [popupActiveTab, setPopupActiveTab] = useState(language.toLowerCase().includes("-sa") ? "KSA" : "All");
  const debouncedQuery = useDebounce(brandsSearchQuery, 300); // Delay for debounce (e.g., 300ms)

  const brandProcessedRef = useRef(false);
  const swiperRef = useRef(null);
  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (handleCountryChange && country !== "sa") {
  //     handleCountryChange("sa");
  //   }
  // }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandsSearchQuery(e.target.value);
  };

  const handleToggleAccordion = (accordion) => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const tabs =
    language.toLowerCase().includes("-sa")
      ? [
          // { label: texts?.allBoutiquesLabel, value: 'All' },
          { label: texts?.ksaLabel, value: 'KSA' },
          { label: texts?.dubaiLabel, value: 'Dubai' },
          { label: texts?.abuDhabiLabel, value: 'Abu Dhabi' },
        ]
      : [
          { label: texts?.allBoutiquesLabel, value: 'All' },
          { label: texts?.dubaiLabel, value: 'Dubai' },
          { label: texts?.abuDhabiLabel, value: 'Abu Dhabi' },
        ];

  const filtersItem = [
    { 
      id: "1", 
      label: texts?.brandsLabel, 
      values: brandCheckboxValues.map(brand => ({ key: brand, label: brand || 'Unknown' }))
    },
    { 
      id: "2", 
      label: texts?.locationsLabel, 
      values: locationCheckboxValues.map(address => ({ key: address, label: address || 'Unknown' }))
    },
    { 
      id: "3", 
      label: texts?.servicesLabel, 
      values: serviceCheckboxValues.map(service => ({ key: service, label: service || 'Unknown' }))
    },
  ];

  const handleStoreClick = (index) => {
    setActiveIndex(index); // Set the clicked store as active
  };

  const [isMobile] = useDeviceWidth();

  const handleStoreDetails = (storeId, showMapView = false) => {
    router.push(`/find-a-boutique-details/${storeId}`);
    query: { mapView: showMapView ? 'true' : 'false' }
  };
  
  const fetchStores = async (location) => {
    try {

      const lat = location ? location.lat.toString() : null;
      const lng = location ? location.lng.toString() : null
      const result = await UseFetchStores('', '', '', '', lat, lng, '', language);
    
      setStores(result.response);

      let filteredStores;
      let filteredCity;
      let filteredAddresses;

      if (language.toLowerCase().includes("-sa")) {
        filteredStores = result.response.filter(store =>
          store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi'
        );

        filteredCity = result.response.filter(store => 
          store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi'
        );

        filteredAddresses = result.response
        .filter(store => store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi')
        .map(store => store.name);

      } else {
        filteredStores = result.response.filter(store =>
          store.city === 'Dubai' || store.city === 'Abu Dhabi'
        );

        filteredCity = result.response.filter(store => 
          store.city === 'Dubai' || store.city === 'Abu Dhabi'
        );

        filteredAddresses = result.response
        .filter(store => store.city === 'Dubai' || store.city === 'Abu Dhabi')
        .map(store => store.name);
      }

      setLocationStores(filteredStores);

      // Extract unique cities
      const uniqueCities = [...new Set(result.response.map(store => store.city))];
      setCities(uniqueCities);

      // Uncomment the first const uniqueAddresses line below for dynamic addresses and comment out the second const uniqueAddresses
      //const uniqueAddresses = [...new Set(result.map(store => store.address1))];
      const uniqueAddresses = [...new Set(filteredAddresses)].sort();
      //setLocationAddresses(uniqueAddresses);
      setLocationCheckboxValues(uniqueAddresses);

      //const uniqueBrands = [...new Set(result.response.flatMap(store => store.c_availableBrands))]; 
      const uniqueBrands = [...new Set(filteredCity.flatMap(store => store.c_availableBrands))].sort();
      setBrandCheckboxValues(uniqueBrands);

      const uniqueServices = [
        ...new Set(
          filteredCity.flatMap(store => store.c_services || []),
        ),
      ].sort();
  
      setServiceCheckboxValues(uniqueServices.filter(service => service));
      
    } catch (error) {
      console.error(error);
      // router.push("/500")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This function gets the user's geolocation
    const getLocation = () => {
      if (navigator.geolocation ) {
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

    const matchesLocale = language.toLowerCase() === router.locale.toLowerCase();

    // Fetch the user's location once on initial mount
    if (!locationFetched && matchesLocale && !hasFetched.current) {
      hasFetched.current = true;
      getLocation();
    }
  }, [locationFetched, language, router.locale, router.isReady]);

  /*useEffect(() => {
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
          fetchStores(null);
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
  }, []);*/

  useEffect(() => {
    if (stores.length > 0 && userLocation) {
      const nearest = calculateNearestStore(stores);
      setNearestStore(nearest);
    }
  }, [stores, userLocation]);

  useEffect(() => {
    //console.log("uniqueBrands2: ", brandCheckboxValues);
  }, [brandCheckboxValues]);

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

  const handleLoadMore = () => {
    setItemsToShow(prevItems => prevItems + 8); // Increment items to show by 8
  };

  const handleTabChange = (tab) => {

    if (tab !== activeTab) {
      setFadeList(true);
      setTimeout(() => {
        setActiveTab(tab);
        setPopupActiveTab(tab);
        setItemsToShow(8);
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

  const handleToggleChange = (toggle) => {
    setFadeList(true);
    setTimeout(() => {
      setActiveToggle(toggle);
      setFadeList(false);
    }, 300);
  };

  const renderStores = (storesList) => {
    const displayedStores = storesList.slice(0, itemsToShow);

    return (
      <>
        <ul className={styles.storeList}>
        {displayedStores.map(store => (
          <li className={styles.store} key={store.id} onClick={() => handleStoreDetails(store.id)}>
           {store.c_storeImage &&
            <div className={styles.storeImageContainer}>
              <img src={store.c_storeImage} alt={store.c_nameCustom} className={styles.storeImage} />

              {/* Uncomment the commented codes below this to show the nearest store label in the image */}
              {/* {activeToggle ? (
                  <>
                    {nearestStore && nearestStore.id === store.id && (
                      <h3 className={styles.nearestStore}>Nearest Store</h3>
                    )}
                  </>
                ) : null} */}
            </div>
            }
            <div className={styles.storeDetails}>
              <h4 className={styles.storeName}>{store.c_nameCustom}</h4>

              <div className={styles.storeLocation}>
                <LocationIcon />

                {(store.c_cityCustom || store.c_address1Custom) && (
                  <p>
                    {[store.c_cityCustom, store.c_address1Custom].filter(Boolean).join(' | ')}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
        </ul>
      
        {storesList.length > itemsToShow && (
          <button className={`${[styles.loadMore]} button transparent`} onClick={handleLoadMore}>{texts?.loadMoreButton}</button>
        )}
      </>
    );
  };

  const renderMaps = (storesList) => {

    const sortedLocationStores = useMemo(() => {
      return [...locationStores].sort((a, b) => {
        const nameA = a.c_nameCustom.toUpperCase();
        const nameB = b.c_nameCustom.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }, [locationStores]);  // Dependency: locationStores
  
    const sortedStoreList = useMemo(() => {
      return [...storesList].sort((a, b) => {
        const nameA = a.c_nameCustom.toUpperCase();
        const nameB = b.c_nameCustom.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }, [storesList]);  // Dependency: storesList
  
    if (storesList.length === 0) return null;


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
            useOnPopup={false}
            handleStoreClick={handleStoreClick}
            swiperRef = {swiperRef}
          />
        )}
        {!userLocation && (
          <MapView 
            nearestStore={null} 
            stores={sortedStoreList} 
            activeStore={filterApplied === true ? sortedStoreList[activeIndex] : sortedLocationStores[activeIndex]}
            userLocation={null} 
            useOnPopup={false}
            handleStoreClick={handleStoreClick}
            swiperRef = {swiperRef}
          />
        )}
        </div>

        {nearestStore && userLocation && (
        <StoreMapListContainer 
          storesList={sortedNearestStores} 
          activeIndex={activeIndex} 
          handleStoreClick={handleStoreClick}
          isMobile={!isMobile} 
          isAbsolutePosition={true}
          needScrollbar={true} //For Desktop Only
        />
        )}
        {!userLocation && (
        <StoreMapListContainer 
          storesList={sortedStoreList} 
          activeIndex={activeIndex} 
          handleStoreClick={handleStoreClick}
          isMobile={!isMobile} 
          isAbsolutePosition={true}
          needScrollbar={true} //For Desktop Only
        />
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

  const popupTabs =
    language.toLowerCase().includes("-sa")
      ? [
          // { label: texts?.allBoutiquesLabel, value: 'All' },
          { label: texts?.ksaLabel, value: 'KSA' },
          { label: texts?.dubaiLabel, value: 'Dubai' },
          { label: texts?.abuDhabiLabel, value: 'Abu Dhabi' },
        ]
      : [
          { label: texts?.allBoutiquesLabel, value: 'All' },
          { label: texts?.dubaiLabel, value: 'Dubai' },
          { label: texts?.abuDhabiLabel, value: 'Abu Dhabi' },
        ];

  const openFilters = () => {
    showFiltersPopup(true);
  };

  const calculateStoreCounts = (storesList) => {
    let combinedStores;
    if (language.toLowerCase().includes("-sa")) {
      combinedStores = storesList.filter(store => 
        store.city.toLowerCase() === 'ksa' || store.city.toLowerCase() === 'dubai' || store.city.toLowerCase() === 'abu dhabi'
      );
    } else {
      combinedStores = storesList.filter(store => 
        store.city.toLowerCase() === 'dubai' || store.city.toLowerCase() === 'abu dhabi'
      );
    }
    
    return {
      All: combinedStores.length,
      ...Object.fromEntries(cities.map(city => [city, combinedStores.filter(store => store.city === city).length])),
    };
  };
  
  // Store counts state
  const [storeCounts, setStoreCounts] = useState(stores.length); //useState(calculateStoreCounts(stores));
  
  // Update store counts whenever filters change
  useEffect(() => {
    setStoreCounts(calculateStoreCounts(getFilteredStores));
  }, [filters, activeTab, stores]);


  useEffect(() => {
    const { brand } = router.query;
  
    const toSentenceCase = (str) => {
      return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
  
    if (brand && brandCheckboxValues.length > 0 && !brandProcessedRef.current) {
      brandProcessedRef.current = true;
  
      // Handle comma-separated list
      let brandList = Array.isArray(brand) ? brand : brand.split(',');
  
      brandList = brandList.map(b => {
        let transformed = b.replace(/_/g, ' ').replace(/\band\b/gi, '&');
        return toSentenceCase(transformed.trim());
      });
  
      // Validate against available brands
      const validBrands = brandList.filter(
        (b) =>
          brandCheckboxValues.find(
            cbv => cbv.toLowerCase() === b.toLowerCase()
          )
      );
  
      setFiltersState(prev => ({
        ...prev,
        '1': validBrands,
      }));
  
      setFilterApplied(validBrands.length > 0);
    }
  }, [router.query, brandCheckboxValues]);
  
  const getFilteredStores = useMemo(() => {
    let filteredStores = stores;

    if (activeTab === 'All') {
      if (language.toLowerCase().includes("-sa")) {
        filteredStores = filteredStores.filter(store =>
          store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi'
        );
      } else {
        filteredStores = filteredStores.filter(store =>
          store.city === 'Dubai' || store.city === 'Abu Dhabi'
        );
      }
    } else {
      filteredStores = filteredStores.filter(store => store.city === activeTab);
    }
  
    // Apply brand filter
    if (filters['1'] && filters['1'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['1'].some(brand =>
          store.c_availableBrands?.includes(brand)
        )
      );
    }
  
    // Apply location filter
    if (filters['2'] && filters['2'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['2'].includes(store.c_nameCustom)
      );
    }
  
    // Apply service filter
    if (filters['3'] && filters['3'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['3'].some(service =>
          store.c_services && Array.isArray(store.c_services) && store.c_services.includes(service)
        )
      );
    }
  
    return filteredStores;
  }, [stores, activeTab, filters]);

  const handleOptionChange = (filterKey, option) => {
    setFiltersState(prevFilters => {
      const prevSelectedOptions = prevFilters[filterKey] || [];
      const newSelectedOptions = prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((selected) => selected !== option)
        : [...prevSelectedOptions, option];
  
      setFilterApplied(newSelectedOptions.length > 0);

      if (filterKey === '1') {
        const params = new URLSearchParams(
          Object.entries(router.query).reduce((acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value[0] : value || '';
            return acc;
          }, {} as Record<string, string>)
        );
  
        if (newSelectedOptions.length > 0) {
          const brandQuery = newSelectedOptions
            .map(b => b.replace(/ & /g, ' and ').replace(/ /g, '_').toLowerCase());
  
          params.set('brand', brandQuery.join(','));
        } else {
          params.delete('brand');
        }
  
        router.replace(
          {
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
          },
          undefined,
          { shallow: true }
        );
      }
  
      return {
        ...prevFilters,
        [filterKey]: newSelectedOptions,
      };
    });
  };
  
  const updateDependentFilters = (filterKey, selectedOptions) => {
    const filteredStores = getFilteredStores;
    const filteredBrands = [...new Set(filteredStores.flatMap(store => store.c_availableBrands))].sort();
    const filteredLocations = [...new Set(filteredStores.map(store => store.c_nameCustom))].sort();
    const filteredServices = [...new Set(filteredStores.flatMap(store => store.c_services))]
        .filter(service => service && service.trim() !== '')
        .sort();
    
    if (filterKey === '1') {
      setLocationCheckboxValues(filteredLocations);
      setServiceCheckboxValues(filteredServices);
    }
  
    else if (filterKey === '2') {
      setBrandCheckboxValues(filteredBrands);
      setServiceCheckboxValues(filteredServices);
    }
  
    else if (filterKey === '3') {
      setBrandCheckboxValues(filteredBrands);
      setLocationCheckboxValues(filteredLocations);
    }
  };

  
  /*useEffect(() => {
    // Whenever `stores`, `activeTab`, or `filters` change, re-filter the stores
    let filteredStores = getFilteredStores;
  
    // Apply city filter (based on activeTab)
    if (popupActiveTab !== 'All') {
      filteredStores = filteredStores.filter(store => store.city === popupActiveTab);
    } else {
      filteredStores = filteredStores.filter(store => store.city === 'Dubai' || store.city === 'Abu Dhabi');
    }
  
    // Apply brand filter
    if (filters['1'] && filters['1'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['1'].some(brand => store.c_availableBrands?.includes(brand))
      );

      updateDependentFilters('1', filters['1']);
    }
  
    // Apply location filter
    else if (filters['2'] && filters['2'].length > 0) {
      filteredStores = filteredStores.filter(store => filters['2'].includes(store.name));

      updateDependentFilters('2', filters['2']);
    }
  
    // Apply service filter
    else if (filters['3'] && filters['3'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['3'].some(service => store.c_services?.includes(service))
      );

      updateDependentFilters('3', filters['3']);
    }

    else{
      updateDependentFilters('1', filters['1']); // Update locations and services based on brands
      updateDependentFilters('2', filters['2']); // Update brands and services based on locations
      updateDependentFilters('3', filters['3']); // Update brands and locations based on services
    }
  
    // Update the filtered stores and dependent filter options
    setFilteredStores(filteredStores);
    
  
  }, [stores, activeTab, filters]);*/

  const updateFilters = (filteredStores) => {
    // Filter locations based on selected stores
    const filteredAddresses = filteredStores.map(store => store.c_nameCustom);
    const uniqueAddresses = [...new Set(filteredAddresses)].sort();  // Ensure unique values and sort alphabetically
    setLocationCheckboxValues(uniqueAddresses);
  
    // Filter and sort Brands, excluding "Unknown" or other invalid brands
    const uniqueBrands = [...new Set(filteredStores.flatMap(store => store.c_availableBrands))]
      .filter((brand) => typeof brand === 'string' && brand.toLowerCase() !== "unknown")  // Exclude "Unknown" brands
      .sort();
    setBrandCheckboxValues(uniqueBrands);
  
    // Filter and sort Services: Exclude "Unknown" services during initial collection
    const uniqueServices = [...new Set(filteredStores.flatMap(store => store.c_services))]
      .map(service => typeof service === 'string' ? service.trim() : '')  // Ensure all services are strings and trim whitespace
      .filter(service => service && service.toLowerCase() !== "unknown")  // Exclude "Unknown" services
      .sort();
    setServiceCheckboxValues(uniqueServices);
  };

  const filteredStoresMemo = useMemo(() => {
    let filteredStores = getFilteredStores;

    // Apply city filter (based on activeTab)
    if (popupActiveTab !== 'All') {
      filteredStores = filteredStores.filter(store => store.city === popupActiveTab);
    } else {
      if(language.toLowerCase().includes("-sa")){
        filteredStores = filteredStores.filter(store => store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi');
      }
      else{
        filteredStores = filteredStores.filter(store => store.city === 'Dubai' || store.city === 'Abu Dhabi');
      }
    }
  
    // Apply brand, location, or service filters
    if (filters['1'] && filters['1'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['1'].some(brand => store.c_availableBrands?.includes(brand))
      );
      updateDependentFilters('1', filters['1']);
    }
  
    if (filters['2'] && filters['2'].length > 0) {
      filteredStores = filteredStores.filter(store => filters['2'].includes(store.c_nameCustom));
      updateDependentFilters('2', filters['2']);
    }
  
    if (filters['3'] && filters['3'].length > 0) {
      filteredStores = filteredStores.filter(store =>
        filters['3'].some(service => store.c_services?.includes(service))
      );
      updateDependentFilters('3', filters['3']);
    }

    // Update the dependent filters (like locations, brands, services)
    updateFilters(filteredStores);
    
    return filteredStores;
  }, [getFilteredStores, popupActiveTab, filters]);
  
  

  const handleDelete = (filterKey, option) => {
    setFiltersState(prevFilters => {
      const prevSelectedOptions = prevFilters[filterKey] || [];
      const newSelectedOptions = prevSelectedOptions.filter(selected => selected !== option);

      // Avoid unnecessary state update if options are the same
      if (JSON.stringify(prevFilters[filterKey]) === JSON.stringify(newSelectedOptions)) {
        return prevFilters;
      }

      return {
        ...prevFilters,
        [filterKey]: newSelectedOptions,
      };
    });
  };

  const handleClearAll = () => {
    // Reset all filters in the `filters` state
    setFiltersState({});
    
    // Clear all the filter values
    setLocationCheckboxValues([]);  // Reset Location filter options
    setBrandCheckboxValues([]);     // Reset Brand filter options
    setServiceCheckboxValues([]);   // Reset Service filter options
    
    // Reset the active tab to 'All' (or your desired default city)
    setActiveTab('All');
    
    // Reset the filtered stores to the original list
    setFilteredStores(stores); // Assuming 'stores' contains the original, unfiltered list of stores.
  };
  
  const handlePopupTabChange = (tab) => {
    if (tab !== popupActiveTab) {
      setFadeList(true);
    
      setTimeout(() => {
        setPopupActiveTab(tab);
        setActiveTab(tab);

        let filteredStores = getFilteredStores;
        
        // Step 1: Filter stores based on the selected location tab
        filteredStores = tab === 'All'
        ? filteredStores.filter(store => 
            (language.toLowerCase().includes("-sa") 
                ? store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi' 
                : store.city === 'Dubai' || store.city === 'Abu Dhabi')
        )
        : filteredStores.filter(store => 
            (language.toLowerCase().includes("-sa") 
                ? store.city === 'KSA' || store.city === 'Dubai' || store.city === 'Abu Dhabi' 
                : store.city === tab)
        );
        
        // Step 2: Apply the brand filter if selected
        if (filters['1'] && filters['1'].length > 0) {
          filteredStores = filteredStores.filter(store =>
            filters['1'].some(brand => store.c_availableBrands?.includes(brand))
          );
        }
    
        // Step 3: Filter and set the location, brand, and services based on the filtered stores
        const filteredAddresses = [...new Set(filteredStores.map(store => store.c_nameCustom))];
        const filteredBrands = [...new Set(filteredStores.flatMap(store => store.c_availableBrands))];
        const filteredServices = [...new Set(filteredStores.flatMap(store => store.c_services))];
    
        setLocationCheckboxValues(filteredAddresses);
        setBrandCheckboxValues(filteredBrands);
        setServiceCheckboxValues(filteredServices);
    
        // Step 4: Update the dependent filters (like locations, brands, services)
        updateFilters(filteredStores);
    
        setFadeList(false);
      }, 300);
    }
  };

  const handleClearCheckboxes = (filterKey) => {
    setFiltersState(prevFilters => ({
      ...prevFilters,
      [filterKey]: [],
    }));
  };

  const totalSelectedCount = filters 
  ? Object.values(filters).reduce((acc: number, curr: unknown) => {
      return acc + (Array.isArray(curr) ? curr.length : 0);
    }, 0)
  : 0;

  const filteredTabs = popupTabs.filter(tab => {
    // Check if there are any stores available in the location tab
    const hasStores = getFilteredStores.some(store => store.city === tab.value);
    return hasStores;
  });

  return (
    <>
      {loading && 
        <Loader />
      }

      <div className={styles.heroBannerWrapper}>
        {content?.page?.heroBanner &&  <HeroBanner
          banners={content.page.heroBanner.banners}
          bannerType={content.page.heroBanner.bannerType}
        />}
      </div>

 
      <div className={styles.storeLocatorContainer}>
        <div className={styles.tabsSwiperContainer}>
          <div className={styles.filtersContainer}>
            <button className={styles.filterButton} onClick={openFilters}>
              <FilterIcon />

              <span>
                {`${texts?.filterByLabel} (${
                  Number(totalSelectedCount) < 10
                    ? `0${totalSelectedCount}`
                    : totalSelectedCount
                })`}
              </span>
            </button>
          </div>

          {/* <LocationTabs activeTab={activeTab} handleTabChange={handleTabChange} tabs={[{ label: 'All Boutiques', value: 'All' }, ...cities.map(city => ({ label: city, value: city }))]}  /> */}
          <LocationTabs
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabs={tabs}
          />
        </div>

        {Object.keys(filters).some(
          (filterKey) =>
            Array.isArray(filters[filterKey]) && filters[filterKey].length > 0
        ) && (
          <div className={styles.optionsContainer}>
            <div className={styles.selectedOptions}>
              {Object.keys(filters).flatMap((filterKey) =>
                Array.isArray(filters[filterKey])
                  ? filters[filterKey].map((option, index) => (
                      <div key={index} className={styles.selectedOption}>
                        <Typography
                          align="left"
                          variant="p"
                          className={styles.option}
                        >
                          {option}
                        </Typography>
                        <div
                          className={styles.deleteOption}
                          onClick={() => handleDelete(filterKey, option)}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    ))
                  : []
              )}
            </div>

            <button
              className={`${styles.clearAll} button plain black_dark`}
              onClick={handleClearAll}
            >
              <span>{texts?.clearAllButton || "Clear All"}</span>
            </button>
          </div>
        )}

        <ToggleMapResults
          onToggle={handleToggleChange}
          activeTab={activeTab}
          storeCounts={storeCounts}
        />

        <div
          className={`${styles.storeListContainer} ${
            fadeList ? styles.fadeOut : styles.fadeIn
          }`}
        >
          {activeToggle
            ? renderStores(getFilteredStores)
            : renderMaps(getFilteredStores)}
        </div>
      </div>
  

      {content?.page?.needMoreHelp && (
        <NeedMoreHelp {...content.page.needMoreHelp} />
      )}

      <SideDrawer
        isOpen={filtersPopup}
        onClose={() => showFiltersPopup(false)}
        showFooter={true}
        onSubmit={null}
        onClearAll={handleClearAll}
        showBackButton={false}
        title={texts?.filterLabel}
        position={""}
        button2Color={"white"}
      >
        {Object.keys(filters).some(
          (filterKey) =>
            Array.isArray(filters[filterKey]) && filters[filterKey].length > 0
        ) && (
          <div className={styles.selectedOptions}>
            {Object.keys(filters).map((filterKey) =>
              Array.isArray(filters[filterKey])
                ? filters[filterKey].map((option, index) => (
                    <div key={index} className={styles.selectedOption}>
                      <Typography
                        align="left"
                        variant="p"
                        className={styles.option}
                      >
                        {option}
                      </Typography>
                      <div
                        className={styles.deleteOption}
                        onClick={() => handleDelete(filterKey, option)}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  ))
                : null
            )}
          </div>
        )}

        <FilterAccordian>
          {filtersItem.map((filterItem) => {
            const selectedOptionsCount = filters[filterItem.id]?.length || 0;

            return (
              <FilterAccordionItem
                key={filterItem.id}
                title={filterItem.label}
                onClear={() => handleClearCheckboxes(filterItem.id)}
                selectedCount={selectedOptionsCount}
                isOpen={openAccordion === filterItem.label.toLowerCase()}
                onToggle={() =>
                  handleToggleAccordion(filterItem.label.toLowerCase())
                }
              >
                {(filterItem.label.toLowerCase() === "brands" || filterItem.label.toLowerCase() === "الماركات") && (
                  <>
                    <div className={styles.searchInputContainer}>
                      <SearchIcon2 className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder={texts?.searchPlaceholder}
                        value={brandsSearchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                      />
                    </div>

                    {filterItem.values && (
                      <>
                        <CheckboxFilter
                          title={filterItem.label}
                          options={brandCheckboxValues.filter(
                            (label) =>
                              label &&
                              label
                                .toLowerCase()
                                .includes(brandsSearchQuery.toLowerCase())
                          )}
                          filterKey={filterItem.id}
                          onOptionChange={handleOptionChange}
                          selectedOptions={filters[filterItem.id] || []}
                        />
                        {filterItem.values.filter(
                          (val) =>
                            val.label &&
                            val.label
                              .toLowerCase()
                              .includes(brandsSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className={styles.noResults}>
                            {texts?.noBrandsFound || "No brands found"}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {(filterItem.label.toLowerCase() === "locations" || filterItem.label.toLowerCase() === "المواقع") && (
                  <>
                    {/* <LocationTabs activeTab={popupActiveTab} handleTabChange={handlePopupTabChange} tabs={[{ label: 'All', value: 'All' }, ...cities.map(city => ({ label: city, value: city }))]}  /> */}
                    <LocationTabs
                      activeTab={popupActiveTab}
                      handleTabChange={handlePopupTabChange}
                      tabs={popupTabs}
                    />

                    <div
                      className={`${styles.locationCheckboxContainer} ${
                        fadeList ? styles.popupFadeOut : styles.popupFadeIn
                      }`}
                    >
                      {filterItem.values &&
                      locationCheckboxValues.length > 0 ? (
                        <CheckboxFilter
                          title={filterItem.label}
                          options={filterItem.values
                            .map((val) => val.label)
                            .filter((label) =>
                              label
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )}
                          filterKey={filterItem.id}
                          onOptionChange={handleOptionChange}
                          selectedOptions={filters[filterItem.id] || []}
                        />
                      ) : (
                        // If no locations available, show a message
                        <div className={styles.noResults}>
                          {texts?.noLocationsFound}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {(filterItem.label.toLowerCase() === "services" || filterItem.label.toLowerCase() === "الخدمات" )&& (
                  <>
                    {filterItem.values && serviceCheckboxValues.length > 0 ? (
                      <CheckboxFilter
                        title={filterItem.label}
                        options={filterItem.values
                          .map((val) => val.label)
                          .filter((label) =>
                            label
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )}
                        filterKey={filterItem.id}
                        onOptionChange={handleOptionChange}
                        selectedOptions={filters[filterItem.id] || []}
                      />
                    ) : (
                      // If no services available, show a message
                      <div className={styles.noResults}>{texts?.noServicesFound || "No services found"}</div>
                    )}
                  </>
                )}
              </FilterAccordionItem>
            );
          })}
        </FilterAccordian>
      </SideDrawer>
    </>
  );
};


FindABoutiqueListing.Layout = Layout;
