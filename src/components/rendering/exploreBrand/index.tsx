import React, { useRef, useEffect, useContext } from "react";
import styles from "./exploreBrand.module.scss";
import Typography from "../../module/typography";
import { Image, Button } from "@components/module";
import { ExploreBrandProps } from "@utils/models/exploreBrand";
import Link from "next/link";
import classNames from "classnames";
import { LanguageContext } from "@contexts/languageContext";

const ExploreBrand: React.FC<ExploreBrandProps> = ({
  cta,
  exploreBrandItems,
  primaryTitle,
  secondaryDescription,
}) => {
  const logoTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const { language } = useContext(LanguageContext);
  const isArabic = language?.startsWith("ar-");
  
  useEffect(() => {
    let start = 0;
    const speed = 0.5;
    let totalWidth = 0;

    const updateTotalWidth = () => {
      if (logoTrackRef.current) {
        totalWidth = logoTrackRef.current.scrollWidth / 2;
      }
    };

    updateTotalWidth();
    const animate = () => {
      if (logoTrackRef.current && !isHoveredRef.current) {
        start += isArabic ? -speed : speed;
        const shouldReset = (!isArabic && start >= totalWidth) || (isArabic && -start >= totalWidth);
        if (shouldReset) {
          start = 0;
        }
        logoTrackRef.current.style.transform = `translateX(${start}px)`;
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", updateTotalWidth);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", updateTotalWidth);
    };
  }, [language]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  const CustomLink = ({ item, children }) => {
    const Component = item?.url ? Link : "span";

    return (
      <Component
        href={item?.url ? item?.url : "/"}
        className={styles.logoContainer}
      >
        {children}
      </Component>
    );
  };

  return (
    <div className={styles.exploreBrandContainer}>
      {primaryTitle && (
        <Typography variant="h2" className={styles.title}>
          {primaryTitle?.toUpperCase()}
        </Typography>
      )}
      {secondaryDescription && (
        <div className={styles.description}>
          <Typography variant="p">{secondaryDescription}</Typography>
        </div>
      )}

      <div
        dir={isArabic ? "ltr" : "rtl"}
        className={styles.logoCarousel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.logoTrack} ref={logoTrackRef}>
          {exploreBrandItems.concat(exploreBrandItems).map((item, index) => (
            <div
              key={index}
              className={classNames(
                styles.logoItem,
                !item?.url && styles.noLink
              )}
            >
              <CustomLink item={item}>
                <Image
                  image={item?.logoIcon?.image?.image}
                  imageAltText={
                    item?.logoIcon?.image?.altText || `Brand Logo ${index + 1}`
                  }
                />
              </CustomLink>
            </div>
          ))}
        </div>
      </div>
      {cta && cta.label && (
        <div className={styles.viewAllButton}>
          <Button
            title={cta.label || "View all Brands"}
            type={cta.type || "solid"}
            color={cta.color || "black_dark"}
            link={cta?.url}
            new_tab={cta?.isNewTab}
          />
        </div>
      )}
    </div>
  );
};

export default ExploreBrand;
