import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./categoryList.module.scss";
import { CategoryListProps } from "@utils/models";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { Button, Typography, CategoryCard } from "@components/module";
import {
  Navigation,
  EffectCoverflow,
  Scrollbar,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";

const CategoryList: React.FC<CategoryListProps> = ({ cta, title, listItems }) => {
  const isMobile = !useDeviceWidth()[0];
  const swiperRef = useRef(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const onSlideChange = useCallback((swiper) => {
    // Handle active index if needed
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (wrapperRef.current) {
        const wrapper = wrapperRef.current.querySelector(
          ".swiper-wrapper"
        ) as HTMLElement;
        const swiperContainer = wrapperRef.current.querySelector(
          ".swiper"
        ) as HTMLElement;

        if (wrapper && swiperContainer) {
          setIsOverflowing(wrapper.scrollWidth > swiperContainer.clientWidth);
        }
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listItems]);

  // After isOverflowing changes and navigation buttons are rendered,
  // update swiper navigation manually.
  useEffect(() => {
    if (swiperRef.current && isOverflowing) {
      // @ts-ignore
      swiperRef.current.navigation.init();
      // @ts-ignore
      swiperRef.current.navigation.update();
    }
  }, [isOverflowing]);

  const hasMediaItems = listItems.some(
    (item) => item.media?.image || item.media?.video
  );

  if (!hasMediaItems || listItems.length < 1) return null;

  return (
    <div
      className={`${styles.categoryListContainer} ${
        isOverflowing ? styles.leftAligned : styles.centered
      }`}
    >
      <Typography variant="h2" className={styles.title}>
        {title}
      </Typography>

      <div
        className={`${styles.categoryListCarousel} ${
          isOverflowing ? styles.leftAligned : styles.centered
        }`}
        ref={wrapperRef}
      >
        <Swiper
          modules={
            isMobile
              ? [Navigation, Scrollbar, Pagination]
              : [Navigation, EffectCoverflow, Scrollbar, Pagination]
          }
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView="auto"
          spaceBetween={20}
          onSlideChange={onSlideChange}
          navigation={
            isOverflowing
              ? {
                  nextEl: `.${styles.swiperButtonNext}`,
                  prevEl: `.${styles.swiperButtonPrev}`,
                  disabledClass: `${styles.swiperButtonDisabled}`,
                }
              : false
          }
          pagination={{
            el: `.${styles.sliderButtonWrapper}`,
            type: "progressbar",
          }}
          className={`${styles.mySwiper} ${
            isOverflowing ? styles.leftAligned : styles.centered
          }`}
        >
          {listItems.map((item, index) => (
            <SwiperSlide className={styles.swiperSlide} key={index}>
              <CategoryCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isOverflowing && (
        <div className={styles.sliderWrapper}>
          <div className={styles.sliderButtonWrapper}></div>
          <div className={styles.swiperButtonPrev}></div>
          <div className={styles.swiperButtonNext}></div>
        </div>
      )}

      {cta?.label && (
        <div className={styles.ctaContainer}>
          <Button 
          title={cta.label} 
          type={cta.type} 
          className={styles.ctaButton} 
          color={cta.color}
          link={cta.url}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList;
