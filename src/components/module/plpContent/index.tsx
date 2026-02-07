import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
// import { useRouter } from "next/router";
import FilterBar from "../filterBar";
import styles from "./productsContent.module.scss";
import GridWrapper from "../gridWrapper";
import ProductCard from "../cards/productCard";
import { ComponentMapping } from "@utils/cms/config";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import Button from "../button";
import {
  getCategoryFilters,
  getProductListing,
  setFilters,
} from "@utils/sfcc-connector/dataService";
import Typography from "../typography";
import Loader from "../loader";
import ScrollToTop from "../scrollToTop";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterObjectRemoveEmptyKey, removeEmptyObjectsByKeys } from "@utils/helpers/removeEmptyObject";
import { plpContentTexts } from "@utils/data/english-arabic-static-data";
import { LanguageContext } from "@contexts/languageContext";


const PlpContent = ({ productGridContent, products }) => {
  const [getProducts, setProducts] = useState(products || []);
  const [filters, setFiltersState] = useState(null);
  const [displayedProducts, setDisplayedProducts] = useState(getProducts?.hits);
  const [currentIndex, setCurrentIndex] = useState(24);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const productsRef = useRef(null);
  const categoryId = getProducts?.selectedRefinements?.cgid || '';
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastRequestRef = useRef('');
  const isRequestPendingRef = useRef(false);

  const { language } = useContext(LanguageContext); 
  const texts = plpContentTexts[language]
  
  const loadMoreProducts = () => {
    const currentScrollPos = window.scrollY;
    const nextIndex = currentIndex + 24;

    if (filters) {
      const currentPage = (nextIndex / 24).toString();
      fetchFilteredProducts(filters, currentPage, false);
    } else {
      fetchAllProductsByCategoryId(nextIndex, false);
    }

    window.scrollTo({
      top: currentScrollPos,
      behavior: "smooth",
    });
  };

  const updateUrlWithFilters = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (value && !Array.isArray(value)) {
        params.set(key, value as string);
      }
    });

    const queryString = params.toString();
    window.history.replaceState(
      { filters: newFilters },
      '',
      `${pathname}${queryString ? `?${queryString}` : ''}`
    );
  }, [pathname]);

  const fetchFilteredProducts = async (selectedFilters, currentPage = '1', shouldUpdateUrl = true) => {
    const requestSignature = JSON.stringify({ selectedFilters, currentPage });
    
    if (
      isRequestPendingRef.current || 
      lastRequestRef.current === requestSignature ||
      isLoading
    ) {
      return;
    }

    isRequestPendingRef.current = true;
    setIsLoading(true);

    let updatedSelectedFilters = filterObjectRemoveEmptyKey(selectedFilters);
    
    if (shouldUpdateUrl && currentPage === '1') {
      updateUrlWithFilters(updatedSelectedFilters);
    }

    try {
      if (Object.keys(updatedSelectedFilters).length === 0) {
        await fetchAllProductsByCategoryId(currentIndex, false);
        setFiltersState(null);
      } else {
        const { sortOption, ...otherFilters } = updatedSelectedFilters;
        const initialFilterLoad = currentPage === '1';
        
        lastRequestRef.current = requestSignature;

        const res = await setFilters({
          method: "GET",
          categoryId: categoryId,
          filters: otherFilters,
          sort: 'availability',
          currentPage: currentPage
        });

        if (lastRequestRef.current === requestSignature) {
          if (res && res.hits) {
            const allProductsLoaded = initialFilterLoad
              ? res.total - res.hits.length === 0
              : res.hits.length + displayedProducts.length === res.total;
          
            const updatedProducts = initialFilterLoad ? res.hits.slice(0, 24) : [...displayedProducts, ...res.hits];
            const nextIndex = initialFilterLoad ? 24 : Number(currentPage) * 24;
          
            setDisplayedProducts(updatedProducts);
            setProducts(res);
            setCurrentIndex(nextIndex);
            setIsAllLoaded(allProductsLoaded);
            setFilterOptions(res.refinements);
            setFiltersState(updatedSelectedFilters);
          } else {
            setDisplayedProducts([]);
            setIsAllLoaded(false);
            setFiltersState(updatedSelectedFilters);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setDisplayedProducts([]);
      setIsAllLoaded(true);
      router.push("/500")
    } finally {
      isRequestPendingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    if (isRequestPendingRef.current || isLoading) return;
    fetchFilteredProducts(newFilters, '1', true);
  }, [isLoading]);

  useEffect(() => {
    if (isRequestPendingRef.current || isLoading) return;

    const params = Object.fromEntries(searchParams.entries());
    
    if (Object.keys(params).length > 0 && !filters) {
      const urlFilters = Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = value.includes(',') ? value.split(',') : [value];
        return acc;
      }, {});

      fetchFilteredProducts(urlFilters, '1', false);
    }
  }, [searchParams, filters]);

  const fetchAllProductsByCategoryId = async (currentProductCount = 24, resetProducts) => {
    setIsLoading(true);

    const newProducts = await getProductListing({
      categoryId: categoryId,
      method: "POST",
      currentPage: (currentProductCount / 24),
      sort: 'availability'
    });

    if (!newProducts) {
      return null;
    }

    const allProductsLoaded = newProducts.total == (displayedProducts.length + newProducts.hits.length);

    if (resetProducts) {
      setProducts(newProducts);
      setDisplayedProducts(newProducts.hits);
      setFiltersState(null);
    } else {
      setDisplayedProducts((restProducts) => [...restProducts, ...newProducts.hits]);
    }

    setCurrentIndex(currentProductCount);
    setIsAllLoaded(allProductsLoaded);
    setIsLoading(false);
  };

  const PRODUCT_INFO_TEXT = texts?.productInfoText(displayedProducts?.length, getProducts?.total)


  return (
    <div ref={productsRef}>
      <div className={styles.container}>
        <FilterBar
          filters={filters || {}}
          onFilterChange={handleFilterChange} // Use the new handler
          totalProducts={getProducts?.total}
          categoryId={categoryId}
          setFilterOptions={setFilterOptions}
          filterOptions={filterOptions}
          resetProducts={fetchAllProductsByCategoryId}
        />

        {displayedProducts?.length > 0 ? (
          <>
            <GridWrapper>
              {displayedProducts.map((item, ind) => (
                <ProductCard
                  key={generateUniqueId()}
                  item={{ ...item, tempId: ind + 1 }}
                  hasCarousel
                />
              ))}
              {productGridContent?.length > 0 &&
                productGridContent?.map((item) => {
                  const Component =
                    ComponentMapping[item?.component?._meta?.schema];
                  return (
                    <div
                      className={styles.contentComponent}
                      style={{ order: item?.position?.slice(-1) }}
                      key={generateUniqueId()}
                    >
                      <Component {...item.component} />
                    </div>
                  );
                })}
            </GridWrapper>
            <div className={styles.bottom}>
              <div className={styles.productInfo}>{PRODUCT_INFO_TEXT}</div>
              {!isAllLoaded && (
                // <div>
                <Button
                  title={texts?.loadMoreText}
                  type="solid metallic"
                  disabled={isAllLoaded}
                  clickHandler={loadMoreProducts}
                />
                // </div>
              )}
            </div>
          </>
        ) : (
          <Typography align="center" variant="h4" className={styles.noProducts}>
            {texts?.noProductsFoundText}
          </Typography>
        )}

        {isLoading && <Loader />}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default PlpContent;
