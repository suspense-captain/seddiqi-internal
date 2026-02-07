import React from "react";
import styles from "./servicePageTabs.module.scss";
import { Button, Image, TabbedNavigation, Typography } from "@components/module";
import { useDeviceWidth } from "@utils/useCustomHooks";
import Link from "next/link";
import RichText from "@components/module/richText";


const ServicePageTabs = ({ rowItems }) => {
  if (!rowItems.length) return null;
  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }
  const isMobile = !useDeviceWidth()[0];
  const tabs = rowItems.map((item, index) => {

    return {
      id: index + 1,
      title: item.tab,
      content: (
        <div key={index} className={styles.subContainer}>
          <div
            className={`${styles.tabContent} ${
              !isMobile && item.imageAlignment === "left"
                ? styles.imageReverse
                : ""
            }`}
          >
              {item.image?.image && (
            <Link href={item.cta?.url || "/"}>

                <Image
                  className={styles.image}
                  image={item.image?.image}
                  imageAltText={item.image?.altText}
                  poiAspect={poiAspect}
                />
            </Link>
                  
              )}
            <div className={styles.textSection}>
              <Link href={item.cta?.url || "/"}>
                <div
                  className={styles.text}
                  style={{ textAlign: item.titleAlignment || "left" }}
                >
                  {item.title && (
                    <Typography variant="h2" className={styles.title}>
                      {item?.title}
                    </Typography>
                  )}
                  <div className={styles.description}>
                    {item.richText && (
                      <RichText align="" text={item?.richText} />
                    )}
                  </div>
                </div>
              </Link>
              {item.cta && item.cta.label && (
                <div className={`${styles.viewAllButton} 
                  ${item?.titleAlignment === 'center' && styles.alignCenter}
		               ${item?.titleAlignment === 'right'  && styles.alignRight}
		                 ${item?.titleAlignment === 'left'  && styles.alignLeft}
                `}>
                  <Button
                    title={item?.cta?.label || "VIEW ALL SPECS"}
                    type={item?.cta?.type || "transparent"}
                    color={item?.cta?.color || "metallic"}
                    link={item.cta?.url}
                    new_tab={item?.cta?.isNewTab}
                    className={styles.ctaButton}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    };
  }
 
  );

  return (
    <div className={styles.container}>
      <TabbedNavigation gap={8} className={styles.tabNavigation} tabs={tabs} scrollToCenterOnMobile={true} />
    </div>
  );
};

export default ServicePageTabs;
