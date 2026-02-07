import React from "react";
import IntroComponentDesktop from "../../module/introComponent/introComponentDesktop";  
import IntroComponentMobile from "../../module/introComponent/IntroComponentMobile";
import styles from "./introComponent.module.scss";

const IntroComponent = ({...content}) => {
  return (
    <>
      <div className={styles.introContainerDesk}>
        <IntroComponentDesktop content={content} />
      </div>
      <div className={styles.introContainerMobile}>
        <IntroComponentMobile content={content} />
      </div>
    </>
  );
};

export default IntroComponent;
