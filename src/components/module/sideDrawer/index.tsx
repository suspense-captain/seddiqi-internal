import React, { ReactNode, useContext, useEffect } from "react";
import styles from "./sideDrawer.module.scss";
import { CloseIconV2 } from "@assets/images/svg";
import Button from "../button";
import Typography from "../typography";
import { ArrowRight } from "@assets/images/svg";
import { LanguageContext } from "@contexts/languageContext";
import { plpContentTexts } from "@utils/data/english-arabic-static-data";

interface SideDrawerProps {
  children: ReactNode;
  isOpen: boolean;
  showFooter: boolean;
  showBackButton: boolean;
  onClose: () => void;
  className?:string;
  title?: string;
  position?: string;
  onSubmit?: () => void;
  onClearAll?: () => void;
  button2Color: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  children,
  isOpen,
  onClose,
  showFooter = true,
  showBackButton = false,
  title,
  onSubmit,
  onClearAll,
  className,
  position = "left",
  button2Color
}) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, [isOpen]);

  const { language } = useContext(LanguageContext); 

  if(!title) {
    title = plpContentTexts[language]?.sortAndFilter
  }

  return (
    <div className={`${styles.drawerWrapper} ${isOpen ? styles.isOpen : ""} ${className}`}>
      <div className={`${styles.underlay}`} onClick={onClose}></div>
      <div className={`${styles.drawer} ${position === "right" ? styles.right : ""} ${isOpen ? styles.open : ""} ${className}`}>
       {(
        <div className={styles.header}>
          {showBackButton ? (
            <span onClick={onClose} className={styles.backButton}>
              <Typography align="left" variant="span" className={styles.backButtonText}>
                <span className={styles.arrowLeftWrapper}>
                  <ArrowRight fill="black" className={styles.arrowLeft} />
                </span>
               {plpContentTexts[language]?.back}
              </Typography>
            </span>
          ) : (
            <Typography align="left" variant="h5" className={styles.sortFilterText}>
              {title}
            </Typography>
          )}
          <span onClick={onClose} className={styles.closeButton}>
            <CloseIconV2 />
          </span>
        </div>
        )}
        <div className={styles.content}>{children}</div>
        {showFooter && (
          <div className={styles.footer}>
            <Button title={plpContentTexts[language]?.clearAll || "CLear All"} type="transparent" clickHandler={onClearAll} />
            <Button title={plpContentTexts[language]?.done || "Done"} type={`solid ${button2Color}`} clickHandler={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;
