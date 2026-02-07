import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import styles from "./familyCarousel.module.scss";
import Popup from "@components/rendering/popup";
import { Button, Image, Typography } from "@components/module";

const FamilyCarousel = (content) => {
  const { title, description, carouselItems, cta } = content;

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSlideClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current;

    const slideEl = swiper.slides[swiper.activeIndex];

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== "width" || e.target !== slideEl) return;

      const dur =
        parseFloat(getComputedStyle(slideEl).transitionDuration) * 1000;

      swiper.updateSlides();
      swiper.updateSlidesOffset();
      swiper.slideTo(swiper.activeIndex, dur, false);
      slideEl.removeEventListener("transitionend", handleTransitionEnd);
    };

    const hasAnim = getComputedStyle(slideEl).transitionDuration !== "0s";

    if (hasAnim) {
      slideEl.addEventListener("transitionend", handleTransitionEnd);
    } else {
      swiper.updateSlides();
      swiper.updateSlidesOffset();
      swiper.slideTo(swiper.activeIndex, 0, false);
    }

    return () =>
      slideEl.removeEventListener("transitionend", handleTransitionEnd);
  }, [activeIndex]);

  return (
    <div className={styles.familyCarousel}>
      {title && (
        <Typography variant="h2" className={styles.heading}>
          {title?.toUpperCase()}
        </Typography>
      )}

      {description && (
        <Typography variant="p" className={styles.description}>
          {description}
        </Typography>
      )}
      <div className={styles.buttonWrapper}>
        {carouselItems?.length && (
          <Swiper
            modules={[Navigation]}
            loop={true}
            rewind={true}
            centeredSlides={true}
            slidesPerView="auto"
            className={styles.mySwiper}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {carouselItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <SwiperSlide
                  key={index}
                  className={`${styles.slide} ${
                    isActive ? styles.activeSlide : ""
                  }`}
                >
                  <div
                    className={styles.familyContainer}
                    onClick={() => handleSlideClick(item)}
                  >
                    {item?.image?.image && (
                      <Image
                        className={styles.image}
                        image={item.image.image}
                        imageAltText={item.image.altText}
                      />
                    )}

                    <div
                      className={`${styles.textContainer} ${
                        isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {item?.nameSource && (
                        <Typography variant="h5" className={styles.nameSource}>
                          {item.nameSource.toUpperCase()}
                        </Typography>
                      )}
                      {item?.nameDesignation && (
                        <Typography
                          variant="p"
                          className={styles.nameDesignation}
                        >
                          {item.nameDesignation}
                        </Typography>
                      )}
                      {cta?.label && (
                        <div
                          className={styles.ctaButton}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Button
                            className={styles.cta}
                            title={cta?.label || "Know More"}
                            isLink={false}
                            link={cta?.url}
                            new_tab={cta?.isNewTab}
                            type={cta?.type}
                            color={cta?.color}
                            clickHandler={() => handleSlideClick(item)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      <Popup
        showPopup={showPopup}
        handleCloseClick={() => setShowPopup(false)}
        className={styles.popupContentsOverride}
      >
        {selectedItem && (
          <div className={styles.popupContent}>
            <div className={styles.popupLeft}>
              {selectedItem?.image?.image && (
                <Image
                  className={styles.popupImage}
                  image={selectedItem.image.image}
                  imageAltText={selectedItem.image.altText}
                />
              )}
            </div>

            <div className={styles.popupRight}>
              {selectedItem?.nameSource && (
                <Typography variant="h2" className={styles.popupName}>
                  {selectedItem.nameSource?.toUpperCase()}
                </Typography>
              )}
              {selectedItem?.description && (
                <Typography variant="p" className={styles.popupDescription}>
                  {selectedItem.description}
                </Typography>
              )}
              {selectedItem?.quotes && (
                <Typography variant="h3" className={styles.popupQuotes}>
                  <span className={styles.quoteLeft}>&ldquo;</span>
                  {selectedItem.quotes}
                  <span className={styles.quoteRight}>&rdquo;</span>
                </Typography>
              )}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default FamilyCarousel;
