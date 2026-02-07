import React, { useEffect, useState } from "react";
import styles from "./scrollToTop.module.scss";
import { ScrollTopIcon } from "@assets/images/svg";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const checkScrollTop = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isVisible) {
    return (
      <div onClick={() => scrollToTop()} className={styles.container}>
        <ScrollTopIcon />
      </div>
    );
  } else {
    return;
  }
};

export default ScrollToTop;
