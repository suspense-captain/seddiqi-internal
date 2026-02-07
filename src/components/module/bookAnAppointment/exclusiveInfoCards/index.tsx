import React from "react";
import styles from "./exclusiveInfoCards.module.scss";
import Image from "@components/module/image";

const ExclusiveInfoCards = ({ ...content }) => {
  if (!content) {
    return null;
  }
  
  const isSansArabic = content?.mainTitleFont?.mainTitleFont === "The Sans Arabic"

  return (
    <div className={styles.container}>
      {content?.title && <div className={`${isSansArabic && styles.sansArabicTitle} ${styles.title}`}>{content?.title}</div>}
      <div className={styles.cards}>
        {content?.listItems?.map((item, index) => {
          return (
            <div className={`${styles[item?.backgroundColor]} ${styles.infoListCard}`} key={index}>
              {item?.logo?.image?.image && (
                <Image
                  height={styles.height}
                  className={styles.image}
                  image={item?.logo?.image?.image}
                  imageAltText={item?.logo?.image?.altText}
                />
              )}

              {item?.title && item?.subTitle && (
                <div className={styles.info}>
                  {item?.title && <div className={styles.infoTitle}>{item?.title}</div>}
                  {item?.subTitle && <div className={styles.infoDesc}>{item?.subTitle}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExclusiveInfoCards;
