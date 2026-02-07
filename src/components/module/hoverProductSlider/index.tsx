import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import styles from "./hoverProductSlider.module.scss";
import Video from "../video";
import Link from "next/link";

const HoverProductSlider = ({
  slides,
  setSwiper,
  setActiveIndex,
  setTransition,
  setSpeed,
  href,
}) => {
  const onSlideChange = (swiperInstance) => {
    setActiveIndex(swiperInstance.realIndex);
  };

  if (!slides) {
    return null;
  }

  return (
    <Swiper
      onSwiper={setSwiper}
      onSlideChange={onSlideChange}
      effect={setTransition}
      fadeEffect={{ crossFade: true }}
      modules={[EffectFade, Pagination]}
      speed={setSpeed}
      loop={true}
    >
      {slides.map((slide, index) => {
        return (
          <SwiperSlide key={index}>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Link href={href} target="_self">
                <Image
                  className={styles.image}
                  src={slide?.absUrl ?? slide?.link}
                  alt={slide?.alt}
                  layout="fill"
                  objectFit="contain"
                />
              </Link>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(HoverProductSlider);
