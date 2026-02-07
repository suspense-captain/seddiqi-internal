import Layout from "@components/layout";
import { Button, Loader } from "@components/module";
import ViewAllBrandsCategory from "@components/module/brands/viewAllBrandsCategory";
import { fetchBrandPages } from "@utils/helpers/fetchBrandPages";
import { getCategory } from "@utils/sfcc-connector/dataService";
import React, { useEffect, useState } from "react";
import styles from "./bookAnAppointmentBrandSearch.module.scss";
import { BrandSearchProps } from "@utils/models/brandSearch";
import BookAnAppointmentBrandListing from "@components/module/bookAnAppointment/bookAnAppointmentBrandListing";

const BookAnAppointmentBrandSearch: React.FC<BrandSearchProps> = ({ categoryType }) => {
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
        {/* <ViewAllBrandsCategory /> */}
        <BookAnAppointmentBrandListing categories={categories} brandPages={brandPages} haveScrollbars={true} categoryType={categoryType} />
      </div>
    </div>
  );
};

export default BookAnAppointmentBrandSearch;
