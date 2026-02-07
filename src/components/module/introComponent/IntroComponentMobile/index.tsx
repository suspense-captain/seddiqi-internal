import React, { useEffect, useRef, useState, useContext } from "react";
import styles from "./IntroComponentMobile.module.scss";
import { GradientOverlay, Image, Video } from "@components/module";
import IntroPopUp from "../introPopUp";
import { SeddiqiLogoBlack } from "@assets/images/svg";
import IntroComponentCarousel from "../introComponentCarousel";
import SearchInputField from "../searchInputField";
import SearchPopUp from "../searchPopUp";
import { LanguageContext } from "@contexts/languageContext";
import { introAndExplore } from "@utils/data/english-arabic-static-data";

const IntroComponentMobile = ({ content }) => {
  const [imageInfo, setImageInfo] = useState(null);
  const [isCarousel, setIsCarousel] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { language } = useContext(LanguageContext)

  const items = [
    content?.topLeftItem,
    content?.topMiddleItem,
    content?.topRightItem,
    content?.bottomLeftItem,
    content?.bottomMiddleItem,
    content?.bottomRightItem,
  ];

  const parallexRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const baseOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const deltaOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const OFFSET = 40;

  useEffect(() => {
    if (!parallexRef.current) return;
    const transform = getComputedStyle(parallexRef.current).transform;
    if (transform && transform !== "none") {
      const match = transform.match(/^matrix\(([^)]+)\)$/);
      if (match) {
        const parts = match[1].split(",").map(parseFloat);
        baseOffset.current = { x: parts[4] || 0, y: parts[5] || 0 };
      }
    }
  }, []);

  const applyTransform = () => {
    if (parallexRef.current) {
      const x = baseOffset.current.x + deltaOffset.current.x;
      const y = baseOffset.current.y + deltaOffset.current.y;
      parallexRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    rafIdRef.current = null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!parallexRef.current) return;

    const t = e.touches[0];
    const rect = parallexRef.current.getBoundingClientRect();
    const xInside = t.clientX - rect.left;
    const yInside = t.clientY - rect.top;

    deltaOffset.current = {
      x: xInside < rect.width / 2 ? OFFSET : -OFFSET,
      y: yInside < rect.height / 2 ? OFFSET : -OFFSET,
    };

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(applyTransform);
    }
  };

  const handleTouchEnd = () => {
    deltaOffset.current = { x: 0, y: 0 };
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(applyTransform);
    }
  };

  useEffect(() => {
    const node = parallexRef.current;
    if (!node) return;

    node.addEventListener("touchmove", handleTouchMove as any, {
      passive: false,
    });
    node.addEventListener("touchend", handleTouchEnd as any, { passive: true });
    node.addEventListener("touchcancel", handleTouchEnd as any, {
      passive: true,
    });

    return () => {
      node.removeEventListener("touchmove", handleTouchMove as any);
      node.removeEventListener("touchend", handleTouchEnd as any);
      node.removeEventListener("touchcancel", handleTouchEnd as any);
    };
  }, [parallexRef.current]);

  if (searchOpen) {
    return (
      <SearchPopUp
        setSearchOpen={setSearchOpen}
        content={content?.searchList}
      />
    );
  }
  if (imageInfo) {
    return <IntroPopUp imageInfo={imageInfo} setImageInfo={setImageInfo} />;
  }
  if (isCarousel) {
    return (
      <IntroComponentCarousel setIsCarousel={setIsCarousel} content={content} />
    );
  }

  return (
    <div className={styles.introContainer}>
      {/* <div className={styles.titleSection}>
        <h1>Ahmed Seddiqi Heritage</h1>
        <p>A pioneer among leading retailers in the region</p>
      </div> */}
      <div className={styles.searchBox}>
        <div
          onClick={() => setSearchOpen(true)}
          className={styles.searchContainer}
        >
          <input
            type="text"
            placeholder={introAndExplore[language]?.searchTextMobile}
            className={styles.input}
          />
          {/* <button className={styles.iconButton}>
            <span className={styles.icon}></span>
          </button> */}
          <div className={styles.seddiqiLogo}>
            <SeddiqiLogoBlack />
          </div>
        </div>
      </div>
      <div onClick={() => setIsCarousel(true)} className={styles.toggleBtn}>
        {introAndExplore[language]?.carouselView}
      </div>
      <div ref={parallexRef} id="parallex" className={styles.container}>
        {items.map((item, idx) => {
          if (!item) return null;
          const classNames = `${styles[`image${idx + 1}`]} ${styles.image}`;

          if (item?.media?.image) {
            return (
              <div key={`img-${idx}`} onClick={() => setImageInfo(item)}>
                <Image
                  className={classNames}
                  image={item.media.image}
                  imageAltText={item.title || "image"}
                />
              </div>
            );
          }

          if (item?.media?.video) {
            return (
              <div key={`vid-${idx}`} onClick={() => setImageInfo(item)}>
                <Video
                  className={classNames}
                  video={item.media.video}
                  autoPlay={item?.media?.autoPlay}
                  showPlay={item?.media?.showPlay}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default IntroComponentMobile;
