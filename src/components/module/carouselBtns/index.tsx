import React, { useCallback } from "react";
import { ArrowRight } from "@assets/images/svg";
import styles from "./carouselBtns.module.scss";

interface CarouselBtnsProps {
  swiper: any;
  activeIndex: number;
  slides: any[];
  btnColor?: string;
  btnWidth?: number;
  activeBtn?: boolean;
}

const CarouselBtns: React.FC<CarouselBtnsProps> = ({
  swiper,
  activeIndex,
  slides,
  btnColor = "metallic",
  btnWidth,
  activeBtn = true,
}) => {
  const handlePaginationClick = useCallback(
    (index) => {
      if (swiper) swiper.slideToLoop(index);
    },
    [swiper]
  );

  const handlePrevClick = useCallback(() => {
    if (swiper) {
      if (activeIndex === 0) {
        swiper.slideToLoop(slides.length - 1);
      } else {
        swiper.slidePrev();
      }
    }
  }, [swiper, activeIndex, slides?.length]);

  const handleNextClick = useCallback(() => {
    if (swiper) {
      if (activeIndex === slides.length - 1) {
        swiper.slideToLoop(0);
      } else {
        swiper.slideNext();
      }
    }
  }, [swiper, activeIndex, slides?.length]);

  return (
    <div className={styles.carousel}>
      {/* <span onClick={handlePrevClick}>
        <ArrowRight className={styles.arrowLeft} />
      </span> */}
      <div className={styles.btns}>
        {slides?.map((_, index) => (
          <div
            style={{ width: index === activeIndex && btnWidth && btnWidth }}
            key={index}
            className={`${styles[btnColor]} ${styles.carouselBtn} ${
              index === activeIndex ? `${activeBtn ? styles.activeCarouselBtn : ""}` : ""
            }`}
            onClick={() => handlePaginationClick(index)}
          />
        ))}
      </div>
      {/* <span onClick={handleNextClick}>
        <ArrowRight className={styles.arrowRight} />
      </span> */}
    </div>
  );
};

export default React.memo(CarouselBtns);
