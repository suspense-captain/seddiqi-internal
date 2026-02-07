import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./rolexHeroBanner.module.scss";
import { ArrowRightThick } from "@assets/images/svg";
import { GradientOverlay, Image, NavigationLink, Video } from "@components/module";
import { useDeviceWidth, useWindowWidth } from "@utils/useCustomHooks";
import CarouselBtns from "@components/module/carouselBtns";
import { useRouter } from "next/router";  


const RolexHeroBanner = ({ ...content }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!content) return null;
  const contentToUse = content.content || content || [];

  const slides = contentToUse?.listItems;

  const bannerType = contentToUse?.listItems[0]?.bannerType;

  const activeSlide = slides[activeIndex] || slides[0];
  let activeBannerSize = activeSlide?.bannerSize;

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleReachEnd = () => {
    setActiveIndex(0);
  };

  let bannerSize = activeBannerSize && activeBannerSize.toLowerCase() === "small_mobile"
  const router   = useRouter();
  const isThankYou = router.asPath.startsWith("/rolex/thank-you");
  

  return (
    <Swiper
      ref={swiperRef}
      modules={[Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      speed={600}
      onSlideChange={handleSlideChange}
      onReachEnd={handleReachEnd}
      className={`
        ${bannerType === "CPO" ? styles.cpoHeroSlider : ""} 
        ${bannerSize ? styles.smallBannerHeroSlider : ""}
        ${styles.heroSlider} 
        ${activeBannerSize && activeBannerSize.toLowerCase() === "small" ? styles.smallHeroSlider : ""}
      `}      
    >
      {slides?.map((slide, index) => {
        return (
          <SwiperSlide className={`${slide?.media?.image && bannerSize && !slide?.mobileMedia?.media?.image && styles.swipeAuto} ${styles.swiperSlide}`} key={index}>
            <div className={`${bannerSize && styles.smallBannerHeroSlider} ${styles.slide}`}>
              {slide?.media?.image || slide?.mobileMedia?.media?.image ? (
                <GradientOverlay className={`${bannerSize && styles.gradientMobile} ${styles.gradient}`}  opacity={slide?.opacity?.opacity}>
                  <Media slide={slide} bannerSize={bannerSize} />
                </GradientOverlay>
              ) : (
                <Video
                  className={styles.video}
                  video={slide?.media?.video}
                  autoPlay={slide?.media?.autoPlay}
                  showPlay={slide?.media?.showPlay}
                />
              )}
              {slide?.bannerType === "Rolex" ? ( 
              <div className={`${styles.textOverlay} ${(slide?.textPosition === "Center") ? styles.centerRolex : ""}`}>

                  {slide?.title && <div className={styles.brand}>{slide?.title}</div>}
                  {slide?.subHeading && <h2 className={styles.title}>{slide?.subHeading}</h2>}
                  {slide?.cta?.label && (
                    <div className={styles.btnContainer}>
                      <NavigationLink
                        className={styles.discoverButton}
                        title={slide?.cta?.label}
                        isNewTab={slide?.cta?.isNewTab}
                        url={slide?.cta?.url}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className={`${styles.textOverlayCpo} ${slide?.textPosition === "Center" ? styles.centerCpo : ""} ${slide?.textColor?.toLowerCase() === "black" ? styles.black : ""}`}>
                  {slide?.title && <div className={styles.brand}>{slide?.title}</div>}
                  {slide?.subHeading && <h2 className={styles.title}>{slide?.subHeading}</h2>}
                  {slide?.cta && slide?.cta?.label && (
                    <div className={styles.btnContainer}>
                      <NavigationLink
                        className={styles.discoverButton}
                        title={slide?.cta?.label}
                        isNewTab={slide?.cta?.isNewTab}
                        url={slide?.cta?.url}
                      />
                    </div>
                  )}
                </div>
              )}

              {slides?.length > 1 && (
                <>
                  {
                    <div className={styles.sliderLeftBtn} onClick={() => swiperRef.current.swiper.slidePrev()}>
                      <ArrowRightThick />
                    </div>
                  }
                  {
                    <div className={styles.sliderRightBtn} onClick={() => swiperRef.current.swiper.slideNext()}>
                      <ArrowRightThick />
                    </div>
                  }
                </>
              )}
            </div>
          </SwiperSlide>
        );
      })}
      {slides?.length > 1 && (
        <div className={styles.carouselBtns}>
          <CarouselBtns
            btnWidth={40}
            activeIndex={activeIndex}
            slides={slides}
            swiper={swiperRef?.current?.swiper}
            btnColor="white"
            activeBtn={false}
          />
        </div>
      )}
    </Swiper>
  );
};

export default RolexHeroBanner;


const Media = ({ slide, bannerSize }) => {
  const [isDesktop] = useDeviceWidth();

  const desktopClass = `${slide?.media?.image && bannerSize && !slide?.mobileMedia?.media?.image && styles.smallMobileBanner} ${!bannerSize && !slide?.mobileMedia?.media && styles.smallBannerimage} ${styles.image}`;
  const mobileClass = `${bannerSize && styles.smallBannerMobileImage} ${styles.mobileImage}`;

  let imgSrc = isDesktop ? slide?.media?.image : slide?.mobileMedia?.media?.image;
  if (!isDesktop && !slide?.mobileMedia?.media?.image) {
    imgSrc = slide?.media?.image;
  }

  return (
    <Image
      imgWidth="100%"
      height={isDesktop ? desktopClass : mobileClass}
      className={isDesktop ? desktopClass : mobileClass}
      image={imgSrc}
      imageAltText={slide?.mobileMedia?.media?.altText}
    />
  );
};