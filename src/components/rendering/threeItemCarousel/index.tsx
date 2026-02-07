import React, { useRef, useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { ArrowRight } from "@assets/images/svg";
import styles from "./threeItemCarousel.module.scss";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import Image from "@components/module/image";
import Typography from "@components/module/typography";
import Button from "@components/module/button";
import Video from "@components/module/video";
import { ContentHeader, GradientOverlay } from "@components/module";
import { useDeviceWidth, useWindowWidth } from "@utils/useCustomHooks";

const ThreeItemCarousel = ({
  mainTitle,
  hideUnderline,
  richText,
  listItems = [],
}) => {
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth < 768) {
      setSlidesPerView(1.2);
      setIsMobile(true);
    } else if (windowWidth < 1250) {
      setSlidesPerView(2);
      setIsMobile(false);
    } else {
      if (listItems?.length > 2) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(2);
      }
      setIsMobile(false);
    }
  }, [windowWidth]);

  const handleSlide = useCallback((direction) => {
    if (swiperRef.current) {
      swiperRef.current[direction === "prev" ? "slidePrev" : "slideNext"]();
    }
  }, []);

  const onSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const imageClassNames =
    listItems.length < 3
      ? `${styles.twoColumnImg} ${styles.image}`
      : styles.image;
  const videoContainerClassNames =
    listItems.length < 3 ? `${styles.twoColumnVid}` : styles.videoContainer;
  const videoClassNames = isMobile ? styles.mobileVid : styles.video;

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  const renderSlide = (item, index) => {
    const isVideo = item?.media?.video;
    const isImage = item?.media?.image;
    const opacity = item?.opacity?.opacity;

    const isDesktop = useDeviceWidth()[0]

    return (
      <SwiperSlide className={styles.swiperSlide} key={index}>
        <GradientOverlay opacity={opacity}>
          <div className={styles.sliderItem}>
            {isImage && (
              <Image
                height={imageClassNames}
                className={imageClassNames}
                image={isDesktop ? item?.media?.image : item?.mobileMedia?.image || item?.media?.image}
                imageAltText={item.media?.altText}
                poiAspect={poiAspect}
              />
            )}
            {isVideo && (
              <div className={videoContainerClassNames}>
                <Video
                  className={videoClassNames}
                  video={isDesktop ? item?.media?.video : item?.mobileMedia?.video || item?.media?.video}
                  autoPlay={isDesktop ? item?.media?.autoPlay : item?.mobileMedia?.autoPlay || item?.media?.autoPlay}
                  showPlay={isDesktop ? item?.media?.showPlay : item?.mobileMedia?.showPlay || item?.media?.showPlay}
                />
              </div>
            )}
            <div className={styles.categoryContent}>
              <Typography className={styles.categoryTitle} variant="h4">
                {item.title}
              </Typography>
              {item?.cta && item?.cta?.label && (
                <Button
                  isLink={true}
                  link={item.cta.url}
                  className={styles.discoverBtn}
                  title={item.cta.label}
                  color={item.cta.color}
                  type={item.cta.type}
                />
              )}
            </div>
          </div>
        </GradientOverlay>
      </SwiperSlide>
    );
  };

  const hasMultipleItems = listItems.length > slidesPerView;
  return (
    <div className={styles.container}>
      {/* CONTAINER HEADER */}
      <ContentHeader
        barColor={styles.barColor}
        subTitleColor={styles.subTitleColor}
        titleColor={styles.titleColor}
        hideUnderline={hideUnderline}
        mainTitle={mainTitle}
        richText={richText}
      />
      <div className={styles.containerSlider}>
        {/* SLIDER BTNS */}
        {hasMultipleItems && !isMobile && (
          <>
            {activeIndex > 0 && (
              <div
                className={styles.leftBtn}
                onClick={() => handleSlide("prev")}
              >
                <ArrowRight fill="white" className={styles.arrowLeft} />
              </div>
            )}
            {activeIndex < listItems.length - slidesPerView && (
              <div
                className={styles.rightBtn}
                onClick={() => handleSlide("next")}
              >
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
          slidesPerView={slidesPerView}
          onSlideChange={onSlideChange}
          className={styles.mySwiper}
        >
          {listItems?.map((item, ind) => renderSlide(item, ind))}
        </Swiper>
      </div>
    </div>
  );
};

export default ThreeItemCarousel;
