import React, { useContext, useRef, useState } from "react";
import styles from "./introComponentCarousel.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { GradientOverlay, Image, Typography, Video } from "@components/module";
import IntroPopUp from "../introPopUp";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import { introAndExplore } from "@utils/data/english-arabic-static-data";
import { LanguageContext } from "@contexts/languageContext";

const IntroComponentCarousel = ({ content, setIsCarousel }) => {
  const [imageInfo, setImageInfo] = useState(null);

  const swiperRef = useRef(null);

  if (imageInfo) {
    return <IntroPopUp imageInfo={imageInfo} setImageInfo={setImageInfo} />;
  }

  const { language } = useContext(LanguageContext)

  const renderSlide = (content, imageClass) => {
    if (content?.media?.image) {
      return (
        <SwiperSlide
          onClick={() =>
            setImageInfo({
              ...content,
            })
          }
          key={generateUniqueId()}
          className={styles.swiperSlide}
        >
          <div className={styles.imageCard}>
            <GradientOverlay className={imageClass} opacity={60}>
              <Image
                className={styles.image}
                image={content?.media?.image}
                imageAltText={"image text"}
              />
            </GradientOverlay>{" "}
          </div>
        </SwiperSlide>
      );
    } else {
      return (
        <SwiperSlide
          onClick={() =>
            setImageInfo({
              ...content,
            })
          }
          key={generateUniqueId()}
          className={styles.swiperSlide}
        >
          <GradientOverlay className={imageClass} opacity={60}>
            <div className={styles.imageCard}>
              <Video
                className={`${imageClass} ${styles.image}`}
                video={content?.media?.video}
                autoPlay={content?.media?.autoPlay}
                showPlay={content?.media?.showPlay}
              />
            </div>
          </GradientOverlay>
        </SwiperSlide>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        {content?.mainTitle && (
          <Typography variant="h3">{content?.mainTitle}</Typography>
        )}
        {content?.description && <p>{content?.description}</p>}
      </div>

      <div className={styles.cards}>
        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={"auto"}
          //onSlideChange={onSlideChange}
          className={styles.mySwiper}
          spaceBetween={24}
          freeMode={true}
          navigation={true}
        >
          {renderSlide(content?.topLeftItem, styles.sliderImage)}
          {renderSlide(content?.topMiddleItem, styles.sliderImage)}
          {renderSlide(content?.topRightItem, styles.sliderImage)}
          {renderSlide(content?.bottomLeftItem, styles.sliderImage)}
          {renderSlide(content?.bottomMiddleItem, styles.sliderImage)}
          {renderSlide(content?.bottomRightItem, styles.sliderImage)}
        </Swiper>
      </div>
      <div onClick={() => setIsCarousel(false)} className={styles.toggleBtn}>
        <div>{introAndExplore[language]?.gridView}</div>
      </div>
    </div>
  );
};

export default IntroComponentCarousel;
