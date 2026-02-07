import React, { useRef, useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { ArrowRight } from "@assets/images/svg";
import styles from "./featuredProductCarousel.module.scss";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useDeviceWidth, useWindowWidth } from "@utils/useCustomHooks";

import Button from "@components/module/button";
import { ContentHeader, FeaturedProductCard } from "@components/module";
import { getProducts } from "@utils/sfcc-connector/dataService";

const FeaturedProductCarousel = ({ mainTitle, hideUnderline, richText, listItems = [], cta }) => {
  if (!listItems) {
    return null;
  }

  const windowWidth = useWindowWidth();
  const [products, setProducts] = useState(null);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      if (listItems) {
        const data = await getProducts({ pids: listItems?.join(","), method: "GET" });
        setProducts(data?.data);
      }
    };
    fetchProducts();
  }, [listItems]);

  useEffect(() => {
    if (windowWidth < 1200) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(3);
    }
  }, [windowWidth]);

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = !useDeviceWidth()[0];

  const handleSlide = useCallback((direction) => {
    if (swiperRef.current) {
      swiperRef.current[direction === "prev" ? "slidePrev" : "slideNext"]();
    }
  }, []);

  const onSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const renderSlide = (item, index) => {
    const isFirstItem = index === activeIndex;
    return (
      <SwiperSlide
        className={`${styles.swiperSlide}`}
        key={index}
        style={isMobile ? { width: "90%" } : {}}
      >
        <div className={styles.sliderItem}>
          <FeaturedProductCard
            isFirstItem={isFirstItem}
            item={{ ...item, image: { absUrl: item?.imageGroups[1]?.images?.[0]?.link } }}
          />
        </div>
      </SwiperSlide>
    );
  };

  const hasMultipleItems = products?.length > 3;

  return (
    <div className={styles.container}>
      {/* CONTAINER HEADER */}
      <ContentHeader richText={richText} hideUnderline={hideUnderline} mainTitle={mainTitle} />
      <div className={styles.containerSlider}>
        {/* SLIDER BTNS */}
        {hasMultipleItems && !isMobile && (
          <>
            {activeIndex > 0 && (
              <div className={styles.leftBtn} onClick={() => handleSlide("prev")}>
                <ArrowRight fill="white" className={styles.arrowLeft} />
              </div>
            )}
            {activeIndex < listItems.length - slidesPerView && (
              <div className={styles.rightBtn} onClick={() => handleSlide("next")}>
                <ArrowRight fill="white" className={styles.arrowRight} />
              </div>
            )}
          </>
        )}
        {/* SLIDER CONTAINER */}
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={isMobile ? "auto" : products?.length < 3 ? products?.length : slidesPerView}
          onSlideChange={onSlideChange}
          className={styles.mySwiper}
        >
          {products?.map((item, index) => renderSlide(item, index))}
        </Swiper>
      </div>
      {cta && cta?.label &&<Button
        isLink={true}
        link={cta.url}
        className={styles.discoverBtn}
        title={cta.label}
        color={cta.color}
        type={cta.type}
      />}
    </div>
  );
};

export default FeaturedProductCarousel;
