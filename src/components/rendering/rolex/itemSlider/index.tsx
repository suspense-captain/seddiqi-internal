import { Image } from "@components/module";
import React, { useContext, useState } from "react";
import styles from "./itemSlider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import { RolexContext } from "@contexts/rolexContext";

const ItemSlider = ({ ...content }) => {
  if (!content) return null;
  const contentToUse = content.content || content || [];

  const sliderItem = contentToUse?.sliderItem;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const poiAspect = { sm: "3:2", md: "2:3", lg: "2:1", xl: "2:1" };

  const { updateRolexContact } = useContext(RolexContext);


  return (
    <div className={styles.container}>
      <div className={styles.sliderContainer}>
        <h3 className={styles.title}>{contentToUse.mainTitle}</h3>

        <Swiper
          slidesPerView={2}
          spaceBetween={8}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            768: {
              slidesPerView: 4,
            },
          }}
          modules={[Navigation, Pagination]}
          className={styles.sliderSwiper}
          onSlideChange={handleSlideChange}
        >
          {sliderItem.map((data, index) => (
            <SwiperSlide
              key={index}
              className={`${[styles.sliderSlide]} ${
                index < activeIndex || index > activeIndex + 3 ? styles.hiddenSlide : ""
              }`}
            >
              {data?.linkUrl === "/contact-us" ? (
                <div  className={styles.sliderLink} onClick={() => updateRolexContact(true)}>
                  <Image
                    imgWidth="100%"
                    height={styles.imgHeight}
                    className={styles.imgHeight}
                    image={data.media?.image}
                    imageAltText={data.media?.altText}
                    poiAspect={poiAspect}
                  />
                  <span className={styles.sliderText}>{data.linkText}</span>
                </div>
              ) : (
                <a href={data?.linkUrl} className={styles.sliderLink}>
                  <Image
                    imgWidth="100%"
                    height={styles.imgHeight}
                    className={styles.imgHeight}
                    image={data.media?.image}
                    imageAltText={data.media?.altText}
                    poiAspect={poiAspect}
                  />
                  <span className={styles.sliderText}>{data.linkText}</span>
                </a>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ItemSlider;
