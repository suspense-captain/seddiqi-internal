import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "@components/module/image"
// import Image from "next/image"
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import styles from "./carousel.module.scss";
import Video from "../video";
import GradientOverlay from "../gradientOverlay";
import { CarouselProps } from "@utils/models";

const Carousel: React.FC<CarouselProps> = ({
  slides,
  setSwiper,
  setActiveIndex,
  setTransition,
  setSpeed,
  isAnimated,
  opacity = 0,
  className,
  imgClass,
  children,
}) => {
  // console.log("slides------", slides)
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
      fadeEffect={{ crossFade: false }}
      modules={[EffectFade, Pagination, Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      speed={setSpeed}
      loop={true}
      // autoHeight={true}
      className={`${isAnimated === "yes" ? styles.swiperScaleEffect : ""}`}
    >
      {slides.map((slide, index) => {
        return (
          <SwiperSlide key={index} className={isAnimated === "yes" ? styles.swiperSlide : ""}>
            <GradientOverlay opacity={opacity} heightClass={className} className={styles.containerImg}>
              {isAnimated === "yes" ? (
                <div
                  style={
                    slide.type === "image"
                      ? {
                          backgroundImage: "url('" + slide.url + "')",
                          backgroundRepeat: "no-repeat",
                          transformOrigin: "50% 50%",
                        }
                      : { position: "relative", width: "100%", height: "100%" }
                  }
                  className={`${slide.type === "image" ? styles.swiperSlideCover : ""}`}
                >
                  {slide.type === "image" ? (
                    ""
                  ) : slide.type === "video" ? (
                    <Video video={slide?.video} autoPlay={slide?.autoPlay} showPlay={slide?.showPlay} />
                  ) : (
                    slide
                  )}
                </div>
              ) : (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {slide.type === "image" ? (
                    <Image  alt={`Slide ${index + 1}`} imageAltText={`Slide ${index + 1}`} className={imgClass} {...(slide as any)} />
                  )  : slide.type === "video" ? (
                    <Video video={slide?.video} autoPlay={slide?.autoPlay} showPlay={slide?.showPlay} />
                  ) : (
                    slide
                  )}
                </div>
              )}
            </GradientOverlay>
            {children && children}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(Carousel);
