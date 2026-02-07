import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./articleListCarousel.module.scss";
import { Button, ContentHeader, GradientOverlay, Image, Typography, Video } from "@components/module";
import { useDeviceWidth, useWindowWidth } from "@utils/useCustomHooks";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { ArrowRight } from "@assets/images/svg";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import RichText from "@components/module/richText";
import Link from "next/link";

const ArticleListCarousel = ({ ...content }) => {
  const listItems = content?.listItems;
  const swiperRef = useRef(null);
  const { cta } = content;
  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }
  const isDesktop = useDeviceWidth()[0]

 
  return (
    <div className={styles.container}>
      <div className={styles.headerItem}>
        {content?.mainTitle && (
          <Typography variant="h2" className={`${styles.headingPrimary}`}>
            {content?.mainTitle}
          </Typography>
        )}

        {content?.richText && (
          <div className={`${styles.headingSecondary}`}>
            <RichText align="" className={`${styles.headingSecondary}`} text={content?.richText} />
          </div>
        )}

        {isDesktop && <div className={styles.btnContainer}><Button isLink={true} link={cta?.url} title={cta?.label} color={cta?.color} type={cta?.type} /></div>}
      </div>
      <div className={styles.carousel}>

        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={"auto"}
          className={styles.mySwiper}
          spaceBetween={20}
          freeMode={true}
          navigation={true}
        >
          {listItems?.map((item, index) => {
            return (
              <SwiperSlide className={styles.swiperSlide} key={index}>
                <GradientOverlay opacity={item?.opacity?.opacity} className={styles.containerImg}>
                  <div className={styles.articleItem}>
                    {item?.media?.image && (
                      <Image height={styles.image} className={styles.image} image={isDesktop ? item?.media?.image : item?.mobileMedia?.image || item?.media?.image} poiAspect={poiAspect}/>
                    )}
                    {item?.media?.video && (
                      <Video
                        className={styles.image}
                        video={isDesktop ? item?.media?.video : item?.mobileMedia?.video || item?.media?.video}
                        autoPlay={isDesktop ? item?.media?.autoPlay : item?.mobileMedia?.autoPlay || item?.media?.autoPlay}
                        showPlay={isDesktop ? item?.media?.showPlay : item?.mobileMedia?.showPlay || item?.media?.showPlay}
                      />
                    )}
                    <div className={styles.articleContent}>
                      {item?.readTime && <div className={styles.label}>{item?.readTime}</div>}
                      {item?.title && <div className={styles.title}>{item?.title}</div>}
                      {item?.subTitle && (
                        <Link href={item?.link}>
                          <div className={styles.desc}>{item?.subTitle}</div>
                        </Link>
                      )}
                    </div>
                  </div>
                </GradientOverlay>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
        { !isDesktop && <div className={styles.btnContainer}><Button isLink={true} link={cta?.url} title={cta?.label} color={cta?.color} type={cta?.type} /></div>}
    </div>
  );
};

export default ArticleListCarousel;
