import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './locationTabs.module.scss';

const LocationTabs = ({ activeTab, handleTabChange, tabs }) => {
  return (
    <Swiper slidesPerView={"auto"} className={styles.tabsSwiper}>
      {tabs.map((tab) => (
        <SwiperSlide className={styles.tabsSwiperSlide} key={tab.value}>
          <button 
            onClick={() => handleTabChange(tab.value)} 
            className={`${styles.tabButton} ${activeTab.toLowerCase() === tab.value.toLowerCase() ? styles.active : ''}`}>
            {tab.label}
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LocationTabs;