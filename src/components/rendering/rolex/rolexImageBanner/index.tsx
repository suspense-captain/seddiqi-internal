import React from "react";
import styles from "./rolexImageBanner.module.scss";
import { Image } from "@components/module";

const RolexImageBanner = ({ desktopImage, mobileImage, altText }) => {
  if (!desktopImage) return null;
  return (
    <div className={styles.rolexImageBannerContainer}>
      <div className={styles.imageContainer}>
        {mobileImage && (
          <div className={styles.mobileImage}>
            <Image
              image={mobileImage.image}
              imageAltText={
                mobileImage.altText || altText || "Rolex Mobile Image Banner"
              }
            />
          </div>
        )}

        <div className={styles.desktopImage}>
          <Image
            image={desktopImage.image}
            imageAltText={
              desktopImage.altText || altText || "Rolex Desktop Image Banner"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default RolexImageBanner;
