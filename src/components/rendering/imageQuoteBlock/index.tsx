import React, { useState } from "react";
import styles from "./imageQuoteBlock.module.scss";
import Typography from "../../module/typography";
import RichText from "../../module/richText";
import { Image } from "@components/module";
import Carousel from "@components/module/carousel";
import CarouselBtns from "@components/module/carouselBtns";
import { ImageQuoteBlockProps } from "@utils/models";
import { useDeviceWidth } from "@utils/useCustomHooks";

const ImageQuoteBlock: React.FC<{ quoteItems: ImageQuoteBlockProps[] }> = ({
  quoteItems,
}) => {
  if (!quoteItems || quoteItems.length === 0) return null;

  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  const isDesktop = useDeviceWidth()[0]

  const slides = quoteItems.map((item, index) => (
    <div className={styles.imageQuoteBlockContainer} key={index}>
      <div className={styles.imageContainer}>
        {item.image && (
          <Image image={isDesktop ? item?.image?.image : item?.mobileMedia?.image || item?.image?.image} imageAltText={item.image.altText} poiAspect={poiAspect}/>
        )}
      </div>
      <div className={styles.quoteContentContainer}>
        <div className={styles.logo}>
          {item.logoIcon && item.logoIcon.image ? (
            <Image
              image={item.logoIcon.image.image}
              imageAltText={item.logoIcon.image.altText}
            />
          ) : null}
        </div>
        <div className={styles.richTextContainer}>
          <div className={styles.richText}>
            <RichText align="center" text={item.richText} />
          </div>
        </div>
        <Typography variant="h5" className={styles.nameSource}>
          {item.nameSource}
        </Typography>
        <Typography variant="p" className={styles.nameDesignation}>
          {item.nameDesignation}
        </Typography>
        {quoteItems?.length > 1 && (
          <div className={styles.carouselBtnsContainer}>
            <CarouselBtns
              swiper={swiper}
              activeIndex={activeIndex}
              slides={quoteItems}
            />
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <div className={styles.carouselContainer}>
      <Carousel
        slides={slides}
        setSwiper={setSwiper}
        setActiveIndex={setActiveIndex}
        setTransition={"slide"}
        setSpeed={500}
        isAnimated={"no"}
      />
    </div>
  );
};

export default ImageQuoteBlock;
