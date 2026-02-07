import { ArrowUp } from "@assets/images/svg";
import RolexIcon from "@assets/images/svg/RolexIcon";
import { Image } from "@components/module";
import React from "react";
import styles from "./footerBackToTop.module.scss";

const FooterBackToTop = ({ contentImage, contentAlt }) => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.footerBackToTopContainer}>
      {contentImage && 
        <Image
          className={styles.rolexIcon}
          imgWidth="auto"
          height={"auto"}
          image={contentImage}
          imageAltText={contentAlt}
        />
      }

      <div className={styles.backToTop}>
        <button className={styles.backToTopButton} onClick={scrollToTop}>
          <div className={styles.arrowIcon}>
            <ArrowUp fill={"white"} />
          </div>
          Back to top
        </button>
      </div>
    </div>
  );
};

export default FooterBackToTop;