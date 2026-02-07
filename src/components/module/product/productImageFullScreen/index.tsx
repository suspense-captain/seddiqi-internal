import styles from "./productImageFullScreen.module.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { ArrowRight, CloseIconV2, MinusIcon, PlusIcon } from "@assets/images/svg";
import Image from "next/image";
import Image2 from "@components/module/image";
import { useDeviceWidth } from "@utils/useCustomHooks";

interface ProductImageFullScreenProps {
  setShowZoom: React.Dispatch<React.SetStateAction<boolean>>;
  listitems: Array<{
    link: string;
    alt: string;
    videoLink1?: string;
  }>;
  thumbnails?: boolean;
  activeImage: number;
  amplienceImageUrl?: string[];
  amplienceImageAltText?: string[];
}

const ProductImageFullScreen: React.FC<ProductImageFullScreenProps> = ({
  setShowZoom,
  listitems,
  thumbnails = true,
  activeImage = 0,
  amplienceImageUrl,
  amplienceImageAltText,
}) => {
  const [activeIndex, setActiveIndex] = useState(activeImage);
  const [swiper, setSwiper] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoomLevel = 3;
  const minZoomLevel = 1;
  const zoomStep = 0.5;

const onSlideChange = useCallback((swiper) => {
  setActiveIndex(swiper.realIndex);
  setZoomLevel(minZoomLevel)
}, []);


  const handlePaginationClick = useCallback(
    (index) => {
      if (swiper) swiper.slideToLoop(index);
    },
    [swiper]
  );

  const handleImageClick = useCallback(() => {
    if (!swiper?.zoom) return;

    if (zoomLevel === minZoomLevel) {
      const newZoom = Math.min(maxZoomLevel, zoomLevel + zoomStep);
      setZoomLevel(newZoom);
      swiper.zoom.in(newZoom);
    } else {
      setZoomLevel(minZoomLevel);
      swiper.zoom.out();
    }
  }, [swiper, zoomLevel]);

  const VideoSlide = ({ item }) => {
    return (
      <div onClick={handleImageClick} className={`${styles.imgContainer} swiper-zoom-container`}>
        <video
          loop
          muted
          autoPlay
          className={styles.videoPlayer}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={item?.videoLink1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  const buildAmplienceUrl = (image) => {
    if (!image?.defaultHost || !image?.endpoint || !image?.name) return "";
    return `https://${image.defaultHost}/i/${image.endpoint}/${encodeURIComponent(image.name)}`;
  };

  const renderSlides = () =>
    listitems?.map((item, index) => (
      <SwiperSlide style={{ height: !thumbnails ? "100%" : "" }} className={styles.swiperSlide} key={index}>
        {item?.videoLink1 ? (
          <VideoSlide item={item} />
        ) : (
          <div className={`swiper-zoom-container ${amplienceImageUrl ? styles.amplienceImage : ""}`}>
            {amplienceImageUrl && amplienceImageUrl.length > 0 ? (
              <Image fill className={styles.image} src={buildAmplienceUrl(amplienceImageUrl[index])} alt={item?.alt} />
            ) : (
              <Image fill className={styles.image} src={item?.link} alt={item?.alt} />
            )}
          </div>
        )}
      </SwiperSlide>
    ));

  const renderThumbnails = () =>
    listitems?.map((item, index) => (
      <div
        key={index}
        className={`${activeIndex === index ? styles.activeImage : ""} ${styles.thumbnail}`}
        onClick={() => handlePaginationClick(index)}
      >
        {item?.videoLink1 ? (
          <VideoSlide item={item} />
        ) : (
          <>
            {amplienceImageUrl && amplienceImageUrl.length > 0 ? (
              <Image2
                className={styles.image}
                image={amplienceImageUrl[index]}
                imageAltText={amplienceImageAltText[index]}
              />
            ) : (
              <Image fill className={styles.image} src={item?.link} alt={item?.alt} />
            )}
          </>
        )}
      </div>
    ));

  const handleSlide = useCallback(
    (direction) => {
      if (swiper) {
        swiper[direction === "prev" ? "slidePrev" : "slideNext"]();
      }
    },
    [swiper]
  );

  const zoomIn = () => {
    if (swiper && swiper.zoom && zoomLevel < maxZoomLevel) {
      const newZoomLevel = zoomLevel + zoomStep;
      setZoomLevel(newZoomLevel);
      swiper.zoom.in(newZoomLevel);
    }
  };

  const zoomOut = () => {
    if (swiper && swiper.zoom && zoomLevel > minZoomLevel) {
      const newZoomLevel = Math.max(minZoomLevel, zoomLevel - zoomStep);
      setZoomLevel(newZoomLevel);
      swiper.zoom.in(newZoomLevel);
    }
  };

  const zoomReset = () => {
    if (swiper && swiper.zoom) {
      setZoomLevel(1);
      swiper.zoom.out();
    }
  };

  useEffect(() => {
    if (swiper && activeIndex !== swiper?.realIndex) {
      swiper?.slideToLoop(activeIndex);
    }
  }, [activeIndex, swiper]);


  const isMobile = !useDeviceWidth()[0];

  return (
    <div className={styles.container}>
      {thumbnails && !isMobile && (
        <div className={styles.sliderBtns}>
          {activeIndex > 0 && (
            <div className={styles.leftBtn} onClick={() => handleSlide("prev")}>
              <ArrowRight fill="white" className={styles.arrowLeft} />
            </div>
          )}
          {activeIndex < listitems.length - 1 && (
            <div className={styles.rightBtn} onClick={() => handleSlide("next")}>
              <ArrowRight fill="white" className={styles.arrowRight} />
            </div>
          )}
        </div>
      )}

      <div onClick={() => setShowZoom(false)} className={styles.closeIcon}>
        <CloseIconV2 />
      </div>

      <Swiper
        style={{ height: !thumbnails ? "100%" : "" }}
        onSwiper={setSwiper}
        modules={[Navigation, EffectCoverflow, Zoom]}
        slidesPerView={1}
        onSlideChange={onSlideChange}
        className={`${styles.mySwiper} ${amplienceImageUrl && isMobile && styles.swiperHeight}`}
        spaceBetween={0}
        zoom={{
          maxRatio: maxZoomLevel,
          minRatio: minZoomLevel,
        }}
      >
        {thumbnails && isMobile && (
        <div className={styles.sliderMobileBtns}>
          {activeIndex > 0 && (
            <div className={styles.leftBtn} onClick={() => handleSlide("prev")}>
              <ArrowRight fill="white" className={styles.arrowLeft} />
            </div>
          )}
          {activeIndex < listitems.length - 1 && (
            <div className={styles.rightBtn} onClick={() => handleSlide("next")}>
              <ArrowRight fill="white" className={styles.arrowRight} />
            </div>
          )}
        </div>
      )}
        {renderSlides()}
      </Swiper>

      {thumbnails && (
        <>
          <div className={styles.thumbnails}>{renderThumbnails()}</div>
          <div className={styles.slideBtns}>
            {listitems?.map((key, ind) => (
              <div
                onClick={() => handlePaginationClick(ind)}
                key={ind}
                className={`${styles.slideItem} ${ind === activeIndex ? styles.slideActive : ""}`}
              >
                &nbsp;
              </div>
            ))}
          </div>
        </>
      )}

      <div onClick={handleImageClick} className={styles.plus}>
        {zoomLevel === minZoomLevel ? <PlusIcon /> : <MinusIcon />}
      </div>
    </div>
  );
};

export default ProductImageFullScreen;
