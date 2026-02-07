import React, { useState } from "react";
import styles from "./quoteBlock.module.scss";
import Typography from "../../module/typography";
import RichText from "../../module/richText";
import { Image } from "@components/module";
import Carousel from "@components/module/carousel";
import CarouselBtns from "@components/module/carouselBtns";
import classNames from "classnames";

const QuoteBlock = ({ quoteItem, backgroundColor, ...content }) => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!quoteItem || quoteItem.length === 0) return null;

  const isSansArabic = content?.mainTitleFont?.mainTitleFont === "The Sans Arabic"

  const slides = quoteItem.map((item, index) => {
    const { logoIcon, richText, nameSource, nameDesignation } = item;
    return (
      <div key={index} className={styles.quoteBlockContainer}>
        {logoIcon && logoIcon.image && (
          <div className={styles.logo}>
            {logoIcon && logoIcon.image ? (
              <Image image={logoIcon.image.image} imageAltText={logoIcon.image.altText} />
            ) : (
              <div className={styles.logoPlaceholder}></div>
            )}
          </div>
        )}

        <div className={styles.richTextContainer}>
          <div className={`${isSansArabic && styles.sansArabic} ${styles.richText}`}>
            <RichText align="center" text={richText} />
          </div>
        </div>
        <Typography variant="h5" className={styles.nameSource}>
          {nameSource}
        </Typography>

        <Typography variant="p" className={styles.nameDesignation}>
          {nameDesignation}
        </Typography>
      </div>
    );
  });

  const wrapperClass = classNames(styles.quoteCarouselWrapper, {
    [styles.primary]: backgroundColor === "primary",
    [styles.secondary]: backgroundColor === "secondary",
  });

  return (
    <div className={wrapperClass}>
      <div className={styles.quoteCarouselContainer}>
        <Carousel
          slides={slides}
          setSwiper={setSwiper}
          setActiveIndex={setActiveIndex}
          setTransition={"slide"}
          setSpeed={500}
          isAnimated={"no"}
        />
        {quoteItem?.length > 1 && (
          <div className={styles.carouselBtnsContainer}>
            <CarouselBtns swiper={swiper} activeIndex={activeIndex} slides={slides} />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteBlock;
