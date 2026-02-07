import { Button, CollectionsCard, ContentHeader, TabbedNavigation } from "@components/module";
import React from "react";
import styles from "./collectionsTabList.module.scss";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useDeviceWidth } from "@utils/useCustomHooks";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { BackgroundStyle } from "@utils/helpers/backgroundStyle";

const CollectionsTabList = ({ ...content }) => {
  const isMobile = !useDeviceWidth()[0];

  let tabs = content?.tabItem?.map((item, index) => {
    return {
      id: index + 1,
      title: item?.tabLabel,
      content: isMobile ? (
        <CollectionsTabMobile ind={index} cta={content?.cta} content={content} />
      ) : (
        <CollectionsTabDesktop ind={index} cta={content?.cta} content={content} />
      ),
    };
  });

  const backgroundColor = content?.backgroundColor;
  const { backgroundStyle, textColor } = BackgroundStyle({ backgroundColor });
  return (
    <div className={`${styles.container} ${backgroundStyle}`}>
      <ContentHeader
        barColor={textColor}
        subTitleColor={styles.subTitleColor}
        titleColor={styles.titleColor}
        hideUnderline={content?.hideUnderline}
        mainTitle={content?.mainTitle}
        richText={content?.richText}
        textColor={textColor}
      />
      <TabbedNavigation gap={isMobile ? 10 : 60} className={styles.tabNavigation} tabs={tabs} />
    </div>
  );
};

const CollectionsTabDesktop = ({ content, cta, ind }) => {
  const listItems = content?.tabItem[ind]?.collectionItems;
  const hideUnderline = content?.tabItem[ind]?.hideUnderline;
  const isProduct = content?.type?.toLowerCase() === "product";

  return (
    <div className={`${styles.containerGrid}`}>
      <div
        className={`
          ${!isProduct && styles.containerGap} 
  ${
    listItems.length === 4
      ? styles.container4Grid
      : listItems.length >= 6
      ? styles.container6Grid
      : styles.containerGridItems
  }`}
      >
        {listItems?.map((item) => {
          return <CollectionsCard totalItems={listItems?.length} item={item} type={content?.type} hideUnderline={hideUnderline} />;
        })}
      </div>
      {cta && cta.label && (
        <Button isLink={true} link={cta?.url} title={cta?.label} color={cta?.color} type={cta?.type} />
      )}
    </div>
  );
};

const CollectionsTabMobile = ({ content, cta, ind }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = !useDeviceWidth()[0];

  const onSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  const listItems = content?.tabItem[ind]?.collectionItems;
  const hideUnderline = content?.tabItem[ind]?.hideUnderline;
  const renderSlide = (item, index) => (
    <SwiperSlide
      className={styles.swiperSlide}
      key={index}
      // style={isMobile ? { width: "90%" } : {}}
    >
      <CollectionsCard totalItems={listItems?.length} item={item} type={content?.type} hideUnderline={hideUnderline} />
    </SwiperSlide>
  );

  return (
    <>
    <div className={styles.containerSlider}>
      <Swiper
        modules={[Navigation, EffectCoverflow]}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={isMobile ? 1.2 : listItems?.length < 3 ? listItems?.length : 3}
        onSlideChange={onSlideChange}
        className={styles.mySwiper}
        >
        {listItems?.map(renderSlide)}
      </Swiper>
    </div>
    {cta && cta?.label && (
        <div>
          <Button isLink={true} link={cta?.url} title={cta?.label} color={cta?.color} type={cta?.type} />
        </div>
      )}
    </>
  );
};

export default CollectionsTabList;
