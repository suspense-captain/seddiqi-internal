import { useEffect, useState } from 'react';
import { SearchProvider } from "@contexts/searchContext";
import {PlpContent, Search} from '@components/module';
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getSearchSuggestions } from "@utils/sfcc-connector/dataService";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { isEmpty } from "@utils/helpers";
import Layout from "@components/layout";
import {
  getProducts,
} from "@utils/sfcc-connector/dataService";
import Typography from "@components/module/typography";
import styles from "./searchStyle.module.scss";


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { recommendations } = context.query;
  const parsedRecommendations = (() => {
    if (Array.isArray(recommendations)) {
      return recommendations.length > 0 ? JSON.parse(recommendations.join('')) : [];
    }

    return recommendations ? JSON.parse(recommendations) : [];
  })();
  
  const data = await fetchStandardPageData(
      {
          content: {
              page: { key: "/" },
          },
      },
      context
  );

  return {
      props: {
          ...data,
          parsedRecommendations

      },
  };
}

export default function SearchPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { parsedRecommendations } = props;
  const [productDetails, setProductDetails] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  // Fetch recommendations from sessionStorage if available
  useEffect(() => {
    const storedRecommendations = sessionStorage.getItem("allProductRecommendations");
    
    if (storedRecommendations) {
    
      const parsedRecommendationsFromStorage = JSON.parse(storedRecommendations);
      
  
      fetchProductDetails(parsedRecommendationsFromStorage);
    } else if (parsedRecommendations?.length > 0) {
      
      fetchProductDetails(parsedRecommendations);
    }
  }, []);

  const fetchProductDetails = async (recommendations: string[]) => {
    if (recommendations.length > 0) {
      try {
    
        const products = await getProducts({
          pids: recommendations, 
          method: "GET", 
        });

     
        if (products) {
          setProductDetails(products.data); 
        } else {
          setError("No products found.");
        }
      } catch (err) {
        setError("Error fetching products.");
        console.error(err); 
      } finally {
        setLoading(false); 
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className="main-content">
      {productDetails?.length > 0 && (
        <>
         <Typography variant="h2" className={styles.searchResultLabel}>
          Search Results
        </Typography>
          <PlpContent 
            products={productDetails}
            productGridContent={null}
          />
        </>
      )}
    </div>
  );
}

SearchPage.Layout = Layout;

