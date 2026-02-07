import React, { useEffect, useState, useMemo } from "react";
import {Image, Typography, CarouselBtns, Carousel} from "@components/module";
import { HeartIcon } from "@assets/images/svg";
import { getProducts } from "@utils/sfcc-connector/dataService";
import HighlightedImage from "./highlightedImage";
import styles from "./highlightedProductCarousel.module.scss";
import { useDeviceWidth } from "@utils/useCustomHooks";

const ProductSlide = ({ item }) => {
  return (
    <div className={styles.product}>
      <div className={styles.productImg}>
        <Image
          className={styles.image}
          src={item?.imageGroups[1]?.images[0]?.link}
          alt={item?.imageGroups[1]?.images[0]?.alt}
          fill image={undefined}
          />
        <div className={styles.icon}>
          <HeartIcon fill="#" />
        </div>
      </div>
      <div className={styles.productContent}>
        <Typography variant="p" className={styles.title}>
          {item?.name}
        </Typography>
        <Typography variant="p" className={styles.type}>
          {item?.brand}
        </Typography>
        <Typography variant="p" className={styles.info}>
          {item?.shortDescription}
        </Typography>
        <Typography variant="p" className={styles.price}>
          {item?.currency} {item?.price}
        </Typography>
      </div>
    </div>
  );
};

const HighlightedProductCarousel = ({ highlightCard, highlightProduct }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [products, setProducts] = useState(null);
  const [isMobile] = useDeviceWidth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (highlightProduct?.listItems) {
        const data = await getProducts({ pids: highlightProduct.listItems.join(","), method: "GET" });
        setProducts(data?.data);
      }
    };
    fetchProducts();
  }, [highlightProduct]);

  const slides = useMemo(
    () => products?.map((item, index) => <ProductSlide key={item.id || index} item={item} />),
    [products]
  );

  if (!products) return null;

  const Title = (
    <Typography align="center" variant="h2" className={styles.headingPrimary}>
      {highlightProduct?.mainTitle}
    </Typography>
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        {!isMobile && Title}
        <div className={styles.containerImg}>
          <HighlightedImage media={highlightCard?.media} opacity={highlightCard?.opacity} />
        </div>
        <div className={styles.productsContainer}>
          {isMobile && Title}
          <Carousel
            setTransition={"fade"}
            setSpeed={2000}
            isAnimated={"yes"}
            slides={slides}
            setSwiper={setSwiper}
            setActiveIndex={setActiveIndex}
          />
          <CarouselBtns slides={products} activeIndex={activeIndex} swiper={swiper} />
        </div>
      </div>
    </div>
  );
};

export default HighlightedProductCarousel;
