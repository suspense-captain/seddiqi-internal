import { Image } from "@components/module";
import React, { useRef, useState, useCallback, useEffect, useContext } from "react";
import styles from "./threeTallImageText.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import { RolexContext } from "@contexts/rolexContext";

const ThreeTallImageText = ({ ...content }) => {
  if (!content) return null;

  const components = content?.components;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const poiAspect = { sm: "1:1", md: "2:1", lg: "1:1", xl: "1:1" };

  const { setRolexCPOContact } = useContext(RolexContext);


  return (
    <div className={styles.sliderContainer}>
      <h3 className={styles.title}>{content.mainTitle}</h3>

      <Swiper
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        breakpoints={{
          1090: {
            spaceBetween: 16,
            slidesPerView: 3,
          },
        }}
        modules={[Navigation, Pagination]}
        className={styles.sliderSwiper}
        onSlideChange={handleSlideChange}
      >
        {components.map((data, index) => (
          <SwiperSlide key={index} className={`${[styles.sliderSlide]}`}>
            {data?.linkUrl === "/contact-us" ? (
              <div onClick={() => setRolexCPOContact(true)} className={styles.sliderLink}>
                <Image
                  imgWidth="100%"
                  height={styles.image}
                  className={styles.image}
                  image={data?.media?.image}
                  imageAltText={data?.media?.altText}
                  poiAspect={poiAspect}
                />

                <span className={styles.sliderText}>{data.linkText}</span>
              </div>
            ) : (
              <a href={data.linkUrl} className={styles.sliderLink}>
                <Image
                  imgWidth="100%"
                  height={styles.image}
                  className={styles.image}
                  image={data?.media?.image}
                  imageAltText={data?.media?.altText}
                  poiAspect={poiAspect}
                />

                <span className={styles.sliderText}>{data.linkText}</span>
              </a>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ThreeTallImageText;
