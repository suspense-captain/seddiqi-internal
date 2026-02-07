import Layout from "@components/layout";
import { BrandListing, Button, Loader, ScrollToTop } from "@components/module";
import ViewAllBrandsCategory from "@components/module/brands/viewAllBrandsCategory";
import { fetchBrandPages } from "@utils/helpers/fetchBrandPages";
import { getCategory } from "@utils/sfcc-connector/dataService";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import styles from "./brandSearch.module.scss";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { BrandSearchProps } from "@utils/models/brandSearch";

const BrandSearch: React.FC<BrandSearchProps> = ({ cta }) => {
  const [categories, setCategories] = useState<any>([]);
  const [brandPages, setBrandPages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch page content client-side
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandPagesResponse = await fetchBrandPages({});
        const brands = await getCategory({ method: "GET", cgid: "brands" });
  
        const fetchedBrandPages = brandPagesResponse.map(
          ({ content }) => ({ url: content._meta.deliveryKey })
        );
  
        setCategories(brands.response.categories); // Assuming this structure
        setBrandPages(fetchedBrandPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.brandSearchContainer}>

      <div className={styles.brandListingContainer}>
        <ViewAllBrandsCategory />
        <BrandListing categories={categories} brandPages={brandPages} haveScrollbars={true} />
      </div>
      
      {cta && cta.label && (
        <Button
          title={cta.label || "View all Brands"}
          type={cta.type || "solid"}
          color={cta.color || "black_dark"}
          link={cta?.url}
          new_tab={cta?.isNewTab}
          className={styles.brandsButton}
        />
      )}
    </div>
  );
};

export default BrandSearch;
