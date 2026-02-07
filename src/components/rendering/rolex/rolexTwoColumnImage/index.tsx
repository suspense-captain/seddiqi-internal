import React from "react";
import styles from "./rolexTwoColumnImage.module.scss";
import { Image } from "@components/module";
import Typography from "@components/module/typography";
import RichText from "@components/module/richText";

const RolexTwoColumnImage = (content) => {

  const { backgroundColor, description, imageLeft, imageRight, title } = content;
  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }
  

  return (
    <div className={`${styles.rolexTwoColumnImageWrapper} ${backgroundColor}`}>
      {title && (
        <Typography align="left" variant="h2" className={styles.title}>
          {title}
        </Typography>
      )}

      {description &&
        Array.isArray(description) &&
        description?.length > 0 && (
          <div className={`${styles.description}`}>
            <RichText
              align=""
              className={`${styles.description}`}
              text={description}
            />
        </div>
      )}

      {(imageLeft || imageRight) && (
        <div className={styles.imageContainer}>
          {imageLeft && (
            <Image
              className={styles.image}
              image={imageLeft?.image?.image}
              imageAltText={imageLeft?.media?.altText}
              poiAspect={poiAspect}
            />
          )}
          {imageRight && (
            <Image
              className={styles.image}
              image={imageRight?.image?.image}
              imageAltText={imageRight?.media?.altText}
              poiAspect={poiAspect}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RolexTwoColumnImage;
