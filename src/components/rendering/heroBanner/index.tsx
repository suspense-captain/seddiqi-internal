import React, { useEffect, useState } from "react";
import styles from "./heroBanner.module.scss";
import { Carousel, CarouselBtns, HeroBannerContent } from "@components/module";
import { useDeviceWidth } from "@utils/useCustomHooks";

interface HeroBannerProps {
  banners: any[];
  bannerType: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banners, bannerType }) => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = !useDeviceWidth()[0]


  if (!banners || banners.length === 0) return null;
  const bannerStyles = {
    full_banner: styles.fullWidth,
    content_banner: styles.mediumWidth,
    small_banner: styles.smallWidth,
  };

  const containerClass = bannerStyles[bannerType] || styles.fullWidth;

const slides = banners
  ?.map((banner) => {
    const media =
      isMobile && banner?.mobile?.media
        ? banner?.mobile?.media
        : banner?.media;

    if (!media) return null;

    if (media?.image) {
      return {
        ...media,
        type: "image",
      };
    } else if (media?.video) {
      return {
        type: "video",
        video: media?.video,
        autoPlay: media?.autoPlay,
        showPlay: media?.showPlay,
      };
    }

    return null;
  })
  .filter(Boolean);


  const activeBanner = banners[activeIndex];
  const alignmentClass = `${activeBanner?.horizontalAlignment || "center"}-${
    activeBanner?.verticalAlignment || "center"
  }`;
  if (!activeBanner?.horizontalAlignment) {
    activeBanner.horizontalAlignment = "center";
  }
  const isCenter = activeBanner?.horizontalAlignment === "center";

  const contentAlign =
    activeBanner?.horizontalAlignment === "right" ? "left" : activeBanner?.horizontalAlignment || "center";

  const isRolex = activeBanner?.brandingType && activeBanner?.brandingType?.toLowerCase() === "rolex";

  return (
    <>
      <div className={`${styles.heroBanner} ${containerClass}`}>
        <div className={styles.heroBannerContainer}>
          <Carousel
            slides={slides}
            setSwiper={setSwiper}
            setActiveIndex={setActiveIndex}
            setTransition={"fade"}
            setSpeed={2000}
            isAnimated={"no"}
            opacity={!activeBanner?.opacity?.hideOverlay ? activeBanner?.opacity?.opacity : null}
            className={bannerStyles[bannerType] || styles.fullWidth}
            imgClass={styles.imgClass}
          >
            {activeBanner && (
              <HeroBannerContent
                activeBanner={activeBanner}
                alignmentClass={alignmentClass}
                contentAlign={contentAlign}
                isRolex={isRolex}
                isCenter={isCenter}
              />
            )}
          </Carousel>
        </div>

        {slides && slides?.length > 1 && (
          <div className={styles.carouselBtnsContainer}>
            <CarouselBtns swiper={swiper} activeIndex={activeIndex} slides={slides} />
          </div>
        )}
      </div>
    </>
  );
};

export default HeroBanner;



