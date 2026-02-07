import React, { useEffect, useRef, useState } from "react";
import Typography from "@components/module/typography";
import RichText from "@components/module/richText";
import styles from "./genericAccordion.module.scss";
import { useDeviceWidth } from "@utils/useCustomHooks";

const GenericAccordionItem = ({ content, isOpen, onClick }) => {
  const { mainTitle, richText } = content;
  const isMobile = !useDeviceWidth()[0];
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [content, isMobile]);

  return (
    <div className={styles.genericAccordionItem}>
      <button
        className={`${styles.genericAccordionButton} ${
          isOpen ? styles.isOpen : ""
        }`}
        onClick={onClick}
      >
        {mainTitle}
      </button>
      <div
        ref={contentRef}
        className={styles.genericAccordionContent}
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
          marginTop: isOpen ? "16px" : "0px",
        }}
      >
        <RichText
          align=""
          className={styles.richTextContainer}
          text={richText}
        />
      </div>
    </div>
  );
};

const GenericAccordion = ({ noPaddingClass, buttonType, ...content }) => {
  const accordionItems = content.accordionItems;
  const [openIndex, setOpenIndex] = useState(null);

  const itemRefs = useRef([]);

  const handleToggle = (index) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);
  
    setTimeout(() => {
      if (newIndex !== null && itemRefs.current[newIndex]) {
        const element = itemRefs.current[newIndex];
        const offset = -100; 
  
        const y =
          element.getBoundingClientRect().top + window.scrollY + offset;
  
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div
      className={`${styles.genericAccordion} ${styles[noPaddingClass || ""]} ${
        buttonType ? styles[buttonType] : ""
      }`}
    >
      {content?.title && (
        <Typography align="left" variant="p" className={styles.title}>
          {content?.title}
        </Typography>
      )}

      {content?.richText && (
        <div className={styles.richTextContainer}>
          <RichText
            align=""
            className={styles.richText}
            text={content?.richText}
          />
        </div>
      )}

      {accordionItems.map((accordionItem, index) => (
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
        >
          <GenericAccordionItem
            content={accordionItem}
            isOpen={openIndex === index}
            onClick={() => handleToggle(index)}
          />
        </div>
      ))}
    </div>
  );
};


export default GenericAccordion;
