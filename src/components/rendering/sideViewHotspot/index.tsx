import { Image } from "@components/module";
import { useDeviceWidth } from "@utils/useCustomHooks";
import { useEffect, useRef, useState } from "react";
import styles from "./sideViewHotspot.module.scss";

const SideViewHotspot = (sideViewData) => {
  const data = sideViewData.sideViewData;

  return (
    <div className={styles.sideViewHotspotContainer}>
      <div className={styles.mainImage}>
        <Image imgWidth="100%" height={"auto"} image={data.media?.image} imageAltText={data.media?.altText} />
      </div>

      {(data.hotspotData[0] || data.hotspotData[1]) &&
      <div className={styles.thumbnailsTop}>

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
      }

      {data.hotspotData[2] &&
        <div className={`${styles.detailsBottom} ${data.hotspotData[2].media ? "" : styles.noImage}`}>
            <div className={styles.detailsContainer}>

              {data.hotspotData[2].media &&
              <div className={styles.imageContainer}>
                <Image imgWidth="100%" height={"auto"} image={data.hotspotData[2].media.image} imageAltText={data.hotspotData[2].media.altText} />
              </div>
              }

              <div className={styles.textsContainer}>
                <h6 className={styles.subtitle}>{data.hotspotData[2].subtitle}</h6>
                <h4 className={styles.title}>{data.hotspotData[2].title}</h4>
                <p className={styles.description}>{data.hotspotData[2].description}</p>
              </div>
            </div>
        </div>
      }
    </div>
  )
};

export default SideViewHotspot;
