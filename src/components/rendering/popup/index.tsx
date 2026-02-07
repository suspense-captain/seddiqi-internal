import React, { ReactNode, useEffect, useState } from "react";
import styles from "./popup.module.scss";
import { CloseIconV2 } from "@assets/images/svg";

interface PopupProps {
  children: ReactNode;
  showPopup: boolean;
  className?: string;
  handleCloseClick?: (value: boolean) => void;
}

const Popup: React.FC<PopupProps> = ({ children, showPopup, className, handleCloseClick}) => {
  const [isShowingPopup, setIsShowingPopup] = useState(showPopup);
  useEffect(() => {
    setIsShowingPopup(showPopup);
  }, [showPopup]);

  useEffect(() => {
    if (isShowingPopup) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isShowingPopup]);

  
  return (
    <div className={` ${styles.popupContainer} ${isShowingPopup ? styles.isShowing : ""} ${className}`}>
      <div className={styles.underlay} onClick={() => handleCloseClick(false)}></div>

      <div className={`${styles.popupContentsContainer}`}>
        <button className={styles.closeButton} onClick={() => handleCloseClick(false)}>
          <CloseIconV2 />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Popup;
