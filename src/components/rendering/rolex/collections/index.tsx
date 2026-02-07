import React, { useState, useRef, useEffect } from "react";
import styles from "./collections.module.scss";
import { useRouter } from "next/router";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import Button from "@components/module/button";
import {
  getProductListing,
  setFilters,
} from "@utils/sfcc-connector/dataService";
import Typography from "@components/module/typography";
import Loader from "@components/module/loader";
import ScrollToTop from "@components/module/scrollToTop";
import RolexProductCard from "../cards/rolexProductCard";

const LOAD_MORE_TEXT = "More results";

const Collections = ({ products, content }) => {
  const { backgroundColor, categoryName, title } = content;
  const backgroundClass = backgroundColor.toLowerCase();
  const categoryArray = categoryName
    ? categoryName.split(",").map((item) => item.trim())
    : [];
  const collectionsTitle = title;

  const router = useRouter();
  const { segments } = router.query;

  const segmentsArray = Array.isArray(segments) ? segments : [segments];
  const isCPO = segmentsArray[0] === "cpo";
  const rolexType = isCPO ? "Rolex Certified Pre-Owned" : "Rolex";
  const rolexCategory = isCPO ? "rolex-cpo" : "rolex";

  const [getProducts, setProducts] = useState(products || []);
  const [filters, setFiltersState] = useState({
    c_family: categoryArray,
    c_brandName: [rolexType],
  });
  const [displayedProducts, setDisplayedProducts] = useState(getProducts?.hits);
  const [currentIndex, setCurrentIndex] = useState(6);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);
  const [, setFilterOptions] = useState([]);
  const productsRef = useRef(null);
  const categoryId = rolexCategory;

  const loadMoreProducts = () => {
    const currentScrollPos = window.scrollY;
    const nextIndex = currentIndex + 6;

    setCurrentIndex(nextIndex);

    const currentPage = (nextIndex / 6).toString();
    fetchFilteredProducts(filters, currentPage);

    window.scrollTo({
      top: currentScrollPos,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!hasInitializedFilters) {
      const applyFiltersOnLoad = async () => {
        const initialFilters = filters || {
          c_family: categoryArray,
          c_brandName: [rolexType],
        };

        await fetchFilteredProducts(initialFilters);
        setHasInitializedFilters(true);
      };

      applyFiltersOnLoad();
    }
  }, [hasInitializedFilters, filters, rolexType]);

  const fetchFilteredProducts = async (selectedFilters, currentPage = "1") => {
    setIsLoading(true);

    try {
      const { sortOption, ...otherFilters } = selectedFilters;
      const initialFilterLoad = currentPage === "1";

      const res = await setFilters({
        method: "GET",
        categoryId: categoryId,
        filters: otherFilters,
        sort: "availability",
        currentPage: currentPage,
        limit: "6",
      });

      if (res && res.hits) {
        const allProductsLoaded = initialFilterLoad
          ? res.total - res.hits.length === 0
          : res.hits.length + displayedProducts.length === res.total;

        const updatedProducts = initialFilterLoad
          ? res.hits.slice(0, 6)
          : [...displayedProducts, ...res.hits];
        const nextIndex = initialFilterLoad ? 6 : Number(currentPage) * 6;

        setDisplayedProducts(updatedProducts);
        setProducts(res);
        setCurrentIndex(nextIndex);
        setIsAllLoaded(allProductsLoaded);
        setFilterOptions(res.refinements);
      } else {
        setDisplayedProducts([]);
        setIsAllLoaded(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setDisplayedProducts([]);
      setIsAllLoaded(true);
      setIsLoading(false);
    }
  };

  if (displayedProducts?.length === 0) {
    return null;
  }

  return (
    <div ref={productsRef}>
      <div className={`${[styles.container]} ${styles[backgroundClass]}`}>
        <div className={styles.mainWrapper}>
          {collectionsTitle && (
            <Typography
              align="center"
              variant="h2"
              className={styles.collectionTitle}
            >
              {collectionsTitle}
            </Typography>
          )}

          <div className={styles.productCardsContainer}>
            {displayedProducts.map((item, ind) => (
              <RolexProductCard
                key={generateUniqueId()}
                item={{ ...item, tempId: ind + 1 }}
                hasCarousel={false}
              />
            ))}
          </div>
          <div className={styles.bottom}>
            {!isAllLoaded && (
              <Button
                title={LOAD_MORE_TEXT}
                type="solid rolex_green"
                disabled={isAllLoaded}
                clickHandler={loadMoreProducts}
              />
            )}
          </div>

          {isLoading && <Loader />}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Collections;
