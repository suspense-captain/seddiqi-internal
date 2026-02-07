import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Pagination } from "swiper/modules";
import styles from "./featuredImageGallery.module.scss";
import "swiper/css";
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useDeviceWidth } from "@utils/useCustomHooks";
import Image from "@components/module/image";
import { GradientOverlay } from "@components/module";

const FeaturedImageGallery = ({...content }) => {
  const timelineGallery = content.timelineGallery.sort((a, b) => a.year - b.year);;
  const swiperRef = useRef(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isNextButtonLocked, setIsNextButtonLocked] = useState(false);
  const [isPrevButtonLocked, setIsPrevButtonLocked] = useState(false);

  const handleProgressClick = (event) => {
    const swiperInstance = swiperRef.current?.swiper;
    if (!swiperInstance) return;

    const progressbar = event.currentTarget;
    const progressWidth = progressbar.clientWidth;
    const clickX = event.nativeEvent.offsetX; // Get the position of the click inside the progress bar
    const clickPercentage = clickX / progressWidth; // Calculate percentage of progress bar clicked
    const slideIndex = Math.floor(clickPercentage * swiperInstance.slides.length); // Calculate the corresponding slide index
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

  return (
    <div className={styles.featuredImageGalleryWrapper}>

      <div className={styles.featuredImageGallery}>

        <div className={styles.titleThumbsContainer}>
          <div className={styles.textsContainer}>
            <h3>{content.mainTitle}</h3>

            {content.subTitle &&
            <p>{content.subTitle}</p>
            }
          </div>

          <div className={styles.thumbnailSwiperContainer}>
            {/* Thumbnail Swiper */}
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Thumbs]}
              spaceBetween={28}
              slidesPerView={'auto'}  // You can adjust the number of thumbnails shown
              loop={false}
              watchSlidesVisibility={true} // Makes thumbnails visible when slides are in view
              watchSlidesProgress={true}  // Sync slides' progress for better interaction
              breakpoints={{
                768: {
                  spaceBetween: 36,  // 4 thumbnails on medium screens
                }
              }}
              className={styles.thumbnailSwiper}
            >
              {timelineGallery.map((data, index) => (
                <SwiperSlide className={styles.thumbSlide} key={index}>
                  <p>{data.year}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Thumbs, FreeMode, Pagination]}
          navigation={{
            prevEl: '.swiper-arrow-prev', // This targets the previous button
            nextEl: '.swiper-arrow-next', // This targets the next button
          }}
          spaceBetween={2}
          slidesPerView={'auto'}
          pagination={{
            clickable: true,
            type: 'progressbar', // Use progressbar pagination
            el: '.featured-image-gallery-progress'
          }}
          loop={false}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,  // Sync with thumbnail swiper
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
          className={`${styles.mainSwiper} ${(isNextButtonLocked && isPrevButtonLocked) ? styles.noPadding : ""}`}
        >
          {timelineGallery.map((data, index) => (
          <SwiperSlide className={styles.mainSwiperSlide} key={index}>
            <div className={`${styles.slideContent} ${styles[`slideContent${data?.position}`]} ${styles.slideContentTextsContainer}`}>
              {data?.itemTitle
              ? <h2>{data.itemTitle}</h2>
              : data?.displayYearAsTitle && <h2>{data.year}</h2>
              }

              {data?.description && 
              <p>{data?.description}</p>
              }
            </div>
            <div className={styles.slideContent}>
              <div className={styles.slideContentImageContainer}>
                {/* <img src={data.imageUrl} className={styles.image} /> */}
                <GradientOverlay opacity={content?.opacity?.opacity}> 
                  <Image
                    className={styles.image}
                    image={data?.media?.image}
                    imageAltText={data?.media?.altText}
                  />
                </GradientOverlay>
                {data.imageTitle && 
                <span className={styles.imageTitle}>{data.imageTitle}</span>
                }
              </div>
            </div>
          </SwiperSlide>
          ))}

          <div className={`swiper-arrow-prev ${styles.swiperArrow} ${styles.swiperPrev}`}></div>
          <div className={`swiper-arrow-next ${styles.swiperArrow} ${styles.swiperNext}`}></div>
          <div className={`featured-image-gallery-progress ${styles.featuredImageGalleryProgress}`}></div>
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedImageGallery;
