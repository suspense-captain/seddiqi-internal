import React, { useState } from "react";
import Typography from "@components/module/typography";
import HeartIcon from "@assets/images/svg/HeartIcon";
import styles from "./productCard.module.scss";
import {Image} from "@components/module";

const FeaturedProductCard = ({ item, isFirstItem=false  }) => {
  if (!item) return null;
  const { name, pricePerUnit, currency,} = item;
  return (
    <div
      className={`${isFirstItem && styles.firstItem} ${styles.productContainer}`}
    >
      <div className={styles.productTop}>
        {/* <div className={styles.newContainer}>
          <div className={styles.new}>New In</div>
        </div> */}
        <HeartIcon fill="#" />
      </div>
      <div className={styles.imgContainer}>
       <Image  alt={`Slide-${name}`} imageAltText={`Slide-${name}`} {...(item as any)} />
      </div>
      <div className={styles.productBottom}>
        <Typography align="center" variant="p" className={styles.title}>
          {name?.default ? name?.default : name}
        </Typography>
        <Typography align="center" variant="p" className={styles.type}>
          {item?.brand}
        </Typography>
        <Typography align="center" variant="p" className={styles.price}>
          {currency} {pricePerUnit}
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(FeaturedProductCard);
