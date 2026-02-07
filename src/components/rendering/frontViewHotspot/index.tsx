import { Image } from "@components/module";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { useEffect, useRef, useState } from "react";
import styles from "./frontViewHotspot.module.scss";

const FrontViewHotspot = (frontViewData) => {
  const data = frontViewData.frontViewData;

  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0); 
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0); 
  const containerRef = useRef(null);
  const [isDesktop] = useDeviceWidth();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rtl = document.documentElement.dir === "rtl";
      setIsRtl(rtl); // Set the RTL status
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDesktop) return; // Prevent dragging on larger screens
    setDragging(true);
    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;
    setStartX(touchStartX);
    setStartY(touchStartY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || isDesktop) return; // Prevent movement on larger screens

    const touchMoveX = e.touches[0].clientX;
    const touchMoveY = e.touches[0].clientY;

    // Calculate the difference between the start and current positions
    const moveDistanceX = touchMoveX - startX;
    const moveDistanceY = touchMoveY - startY;

    // If the vertical distance is greater than the horizontal, ignore the movement (i.e., it's a vertical swipe)
    if (Math.abs(moveDistanceY) > Math.abs(moveDistanceX)) return;

    const containerWidth = containerRef.current?.offsetWidth || 0;

    // Apply constraints based on RTL or LTR
    const maxLimit = isRtl ? containerWidth / 2 : 0;
    const minLimit = isRtl ? 0 : -containerWidth / 2;

    // Constrain the movement between 0 and 50% of the container width for RTL, or the normal range for LTR
    const constrainedX = isRtl
      ? Math.max(Math.min(moveDistanceX, maxLimit), minLimit)
      : Math.max(Math.min(moveDistanceX, maxLimit), minLimit);

    setCurrentX(constrainedX);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };
  

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const initialPosition = isRtl ? containerWidth / 2 : -containerWidth / 2;
      setCurrentX(initialPosition);
      containerRef.current.style.transform = `translateX(${initialPosition}px)`;
    }
  }, [isDesktop, isRtl]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${currentX}px)`;
    }
  }, [currentX]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let initialPosition = 0;

        // If it's desktop, we use the initial position (0 for LTR, containerWidth / 2 for RTL)
        if (isDesktop) {
          initialPosition = isRtl ? containerWidth / 2 : 0;
        } else {
          // On mobile, initial position is always set to -50% of the container width
          initialPosition = isRtl ? containerWidth / 2 : -containerWidth / 2;
        }

        setCurrentX(initialPosition);
        containerRef.current.style.transform = `translateX(${initialPosition}px)`;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isRtl, isDesktop]);

  return (
    <div
      ref={containerRef}
      className={styles.frontViewHotspotContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={styles.mainImage}>
        <Image imgWidth="100%" height={"auto"} image={data.media?.image} imageAltText={data.media?.altText} />
      </div>

      {data.hotspotData[0] &&
        <div className={`${styles.detailsLeft} ${data.hotspotData[0].media ? "" : styles.noImage}`}>
          <div className={styles.detailsContainer}>

            {data.hotspotData[0].media &&
              <div className={styles.imageContainer}>
                <Image imgWidth="100%" height={"auto"} image={data.hotspotData[0].media.image} imageAltText={data.hotspotData[0].media.altText} />
              </div>
            }

            <div className={styles.textsContainer}>
              <h6 className={styles.subtitle}>{data.hotspotData[0].subtitle}</h6>
              <h4 className={styles.title}>{data.hotspotData[0].title}</h4>
              <p className={styles.description}>{data.hotspotData[0].description}</p>
            </div>
          </div>
        </div>
      }

      {data.hotspotData[1] &&
        <div className={`${styles.detailsRight} ${data.hotspotData[1].media ? "" : styles.noImage}`}>
            <div className={styles.detailsContainer}>

              {data.hotspotData[1].media &&
                <div className={styles.imageContainer}>
                  <Image imgWidth="100%" height={"auto"} image={data.hotspotData[1].media.image} imageAltText={data.hotspotData[1].media.altText} />
                </div>
              }

              <div className={styles.textsContainer}>
                <h6 className={styles.subtitle}>{data.hotspotData[1].subtitle}</h6>
                <h4 className={styles.title}>{data.hotspotData[1].title}</h4>
                <p className={styles.description}>{data.hotspotData[1].description}</p>
              </div>
            </div>
        </div>
      }
        
    </div>
  )
};

export default FrontViewHotspot;
