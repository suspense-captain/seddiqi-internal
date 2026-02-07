import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Thumbs,
  FreeMode,
  Pagination,
} from "swiper/modules";
import styles from "./featuredCardCarousel.module.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useDeviceWidth } from "@utils/useCustomHooks";
import Image from "@components/module/image";
import { GradientOverlay, ProductImageFullScreen } from "@components/module";

const FeaturedCardCarousel = ({ ...content }) => {
  const cards = content.cards;

  const isWhite =
    content?.backgroundColor?.toLowerCase() === "white" ? true : false;
  const bgColor = isWhite ? "bg-white" : "midnight-brown";

  const swiperRef = useRef(null);
  const [isDesktop] = useDeviceWidth();
  const [showZoom, setShowZoom] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isNextButtonLocked, setIsNextButtonLocked] = useState(false);
  const [isPrevButtonLocked, setIsPrevButtonLocked] = useState(false);

  const cardImageUrl = cards.map((item) => item?.media?.image);
  const cardImageAltText = cards.map((item) => item?.media?.altText);

  const handleProgressClick = (event) => {
    const swiperInstance = swiperRef.current?.swiper;
    if (!swiperInstance) return;

    const progressbar = event.currentTarget;
    const progressWidth = progressbar.clientWidth;
    const clickX = event.nativeEvent.offsetX; // Get the position of the click inside the progress bar
    const clickPercentage = clickX / progressWidth; // Calculate percentage of progress bar clicked
    const slideIndex = Math.floor(
      clickPercentage * swiperInstance.slides.length
    ); // Calculate the corresponding slide index
    swiperInstance.slideTo(slideIndex); // Navigate to the slide
  };

  const updateButtonLockState = (swiperInstance) => {
    setIsNextButtonLocked(swiperInstance.isEnd); // Check if it's at the last slide
    setIsPrevButtonLocked(swiperInstance.isBeginning); // Check if it's at the first slide
  };

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      updateButtonLockState(swiperInstance);
    }
  }, []);

  // content.hideCarouselControls = false;
  // content.hidePlusIcon = false;

  return (
    <>
      <div
        className={`${styles.featuredImageGalleryWrapper} ${styles[bgColor]}`}
      >
        <div className={styles.featuredImageGallery}>
          <div className={styles.titleThumbsContainer}>
            <div className={styles.textsContainer}>
              {content?.mainTitle && (
                <h3 className={isWhite && styles.mainTitleBlack}>
                  {content?.mainTitle}
                </h3>
              )}
            </div>
          </div>

          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Navigation, FreeMode, Pagination]}
            navigation={{
              prevEl: ".swiper-arrow-prev", // This targets the previous button
              nextEl: ".swiper-arrow-next", // This targets the next button
            }}
            spaceBetween={2}
            slidesPerView={"auto"}
            pagination={{
              clickable: true,
              type: "progressbar", // Use progressbar pagination
              el: ".featured-image-gallery-progress",
            }}
            loop={true} // Enable looping
            autoplay={{
              delay: content?.carouselInterval
                ? content?.carouselInterval * 1000
                : 5000, // Set autoplay delay to 5 seconds
              disableOnInteraction: false, // Keep autoplay running even if user interacts with the carousel
            }}
            onInit={(swiper) => {
              // Initial state check when the Swiper is initialized
              updateButtonLockState(swiper);
            }}
            onResize={() => {
              // Update button lock state on resize
              const swiperInstance = swiperRef.current.swiper;
              updateButtonLockState(swiperInstance);
            }}
            className={`${
              !content?.hideCarouselControls && styles.mainSwiperPadding
            } ${styles.mainSwiper} ${
              isNextButtonLocked && isPrevButtonLocked ? styles.noPadding : ""
            }`}
          >
            {cards.map((data, index) => (
              <SwiperSlide className={styles.mainSwiperSlide} key={index}>
                <GradientOverlay opacity={data?.opacity?.opacity}>
                  <div className={styles.slideContent}>
                    <div className={styles.slideContentImageContainer}>
                      {/* <img src={data.imageUrl} className={styles.image} /> */}
                      <Image
                        className={styles.image}
                        image={cardImageUrl[index]}
                        imageAltText={cardImageAltText[index]}
                      />

                      {data?.imageTitle && (
                        <span className={styles.imageTitle}>
                          {data.imageTitle}
                        </span>
                      )}

                      {!content?.hidePlusIcon && (
                        <button
                          className={styles.zoomButton}
                          onClick={() => {
                            setShowZoom(true);
                            setActiveIndex(index);
                          }}
                        ></button>
                      )}
                    </div>
                  </div>
                </GradientOverlay>
              </SwiperSlide>
            ))}

            {!content?.hideCarouselControls && (
              <>
                <div
                  className={`swiper-arrow-prev ${styles.swiperArrow} ${
                    isWhite && styles.swiperPrevWhite
                  } ${styles.swiperPrev}`}
                ></div>
                <div
                  className={`swiper-arrow-next ${styles.swiperArrow} ${
                    isWhite && styles.swiperNextWhite
                  } ${styles.swiperNext}`}
                ></div>
                <div
                  className={`featured-image-gallery-progress ${
                    isWhite && styles.featuredImageGalleryProgressWhite
                  } ${styles.featuredImageGalleryProgress}`}
                ></div>
              </>
            )}
          </Swiper>
        </div>
      </div>
      {showZoom && (
        <ProductImageFullScreen
          setShowZoom={setShowZoom}
          activeImage={activeIndex}
          
          listitems={content?.cards}
          amplienceImageUrl={cardImageUrl}
          amplienceImageAltText={cardImageAltText}
        />
      )}

      
    </>
  );
};

export default FeaturedCardCarousel;
