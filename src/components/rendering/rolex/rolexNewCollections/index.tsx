import React, { useState, useRef, useEffect } from "react";
import styles from "./rolexNewCollections.module.scss";
import Link from "next/link";
import Image from "next/image";
import Button from "@components/module/button";
import {
  getProducts
} from "@utils/sfcc-connector/dataService";
import Typography from "@components/module/typography";
import Loader from "@components/module/loader";
import RichText from "@components/module/richText";
import { NavigationLink } from "@components/module";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const RolexNewCollections = ({ ...content }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [productCollections, setProductCollections] = useState(null);
  
  const fetchProduct = async (productIds) => {
    if (productIds.length > 0) {
      try {
    
        const products = await getProducts({
          pids: productIds, 
          method: "GET", 
        });

      
        if (products) {
          setProductCollections(products.data);
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

  useEffect(() => {
    const productIds = content.productIds?.map((item) => item.title) || [];
    fetchProduct(productIds);
  }, [content.productIds]);

  const backgroundClass = content?.backgroundColor?.toLowerCase();

  return(
    <div className={`${styles.newCollectionsWrapper} ${styles[backgroundClass]}`}>

      {(content?.title || content?.richText) && (
      <div className={styles.textsContainer}>

        {content?.title && (
        <Typography variant="h2" className={styles.title}>
        {content?.title}
        </Typography>
        )}

        {content?.richText && (
        <div className={styles.richTextContainer}>
          <RichText align="" text={content?.richText} />
        </div>
        )}
      </div>
      )}

      <div className={styles.newCollections}>
        {productCollections && productCollections.length > 0 && (
          <Swiper
            spaceBetween={6}
            slidesPerView={2}
            slidesPerGroup={2}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Navigation, Pagination]}
            breakpoints={{
              768: {
                spaceBetween: 8,
                slidesPerView: 3,
                slidesPerGroup: 1
              },
              1280: {
                slidesPerView: 4,
              }
            }}
            className={styles.newCollectionsSwiper}
          >
            {productCollections.map((product, index) => (
              <SwiperSlide key={index} className={styles.newCollectionsSwiperSlide}>
                <Link href={`/product/${encodeURIComponent(product.id)}`} target="_self" className={styles.product}>
                  <Image
                    className={styles.image}
                    src={product.imageGroups[0].images[0].link}
                    alt={product.c_model}
                    layout="fill"
                    objectFit="contain"
                  />

                  <div className={styles.productDetails}>
                    <Typography variant="h6" className={styles.brand}>
                    {product.c_brandName}
                    </Typography>

                    <Typography variant="h5" className={styles.model}>
                    {product.c_model}
                    </Typography>

                    <Typography variant="p" className={`${styles.desc}`}>
                      {product.shortDescription.substring(product.shortDescription.indexOf(",") + 1).trim()}
                    </Typography>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <NavigationLink
          className={styles.ctaButton}
          title={content?.ctaText}
          isNewTab={false}
          url={content?.ctaLink}
        />
      </div>
    </div>
  )
};

export default RolexNewCollections;