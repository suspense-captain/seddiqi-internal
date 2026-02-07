import React, { useState } from "react";
import Typography from "@components/module/typography";
import HeartIcon from "@assets/images/svg/HeartIcon";
import styles from "./rolexProductCard.module.scss";
import Image from "next/image";
import { HoverProductSlider, CarouselBtns } from "@components/module";

interface Props {
  item: any;
  hasCarousel?: boolean;
}

const RolexProductCard = ({ item, hasCarousel = false }: Props) => {
  if (!item) return null;

  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    name,
    image,
    pricePerUnit,
    priceCurrency,
    c_brandName,
    c_model,
    c_strapDescription,
    c_size,
    c_caseMaterial,
    c_edition,
    c_additionalField1,
    imageGroups,
    productId,
    representedProduct,
    orderable
  } = item;

  const cleanedId = (id ?? productId).replace(/\//g, "%2F");

  const buildDescription = () => {
    const descriptionParts = [
      c_strapDescription ?? representedProduct?.c_strapDescription,
      c_size ? `${c_size} mm` : (representedProduct?.c_size ? `${representedProduct.c_size} mm` : null),
      c_caseMaterial ?? representedProduct?.c_caseMaterial
    ];
  
    // Filter out undefined or null values, and join with commas
    return descriptionParts.filter(Boolean).join(", ");
  };

  return (
    <a
      href={`/product/${cleanedId}`}
      style={{
        order: item?.tempId,
        gridRowEnd: `span 1`,
        gridColumnEnd: `span 1`,
      }}
      className={styles.productContainer}
    >
      <div className={styles.imgContainer}>
        {imageGroups && hasCarousel && isHovered ? (
          <HoverProductSlider
            slides={imageGroups[0].images}
            setSwiper={setSwiper}
            setActiveIndex={setActiveIndex}
            setTransition={"slide"}
            setSpeed={500}
            href={`/product/${cleanedId}`}
          />
        ) : (
          <Image
            layout="fill"
            objectFit="contain"
            alt={`Non-Slide`}
            src={image?.absUrl || image?.link || ''}
          />
        )}
      </div>
      <div className={styles.productBottom}>
        <Typography align="center" variant="p" className={styles.brandName}>
          {c_brandName ?? representedProduct?.c_brandName}
        </Typography>

        <Typography align="center" variant="h4" className={styles.modelName}>
          {(c_model ?? representedProduct?.c_model)}
        </Typography>

        <Typography align="center" variant="p" className={styles.description}>
          {buildDescription()}
        </Typography>
        {imageGroups && hasCarousel && isHovered && (
          <CarouselBtns
            swiper={swiper}
            activeIndex={activeIndex}
            slides={imageGroups[0].images}
            btnWidth={16}
            btnColor={"grey-light-5"}
          />
        )}
      </div>
    </a>
  );
};

export default React.memo(RolexProductCard);
