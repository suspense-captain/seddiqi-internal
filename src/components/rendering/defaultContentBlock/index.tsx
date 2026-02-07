import React from "react";
import styles from "./defaultContentBlock.module.scss";
import { Button, Typography } from "@components/module";
import RichText from "@components/module/richText";

const DefaultContentBlock = ({...content}) => {
  if (!content) return null;
  const { cta, alignment } = content;

  const alignmentClass = alignment === 'leftAligned' ? styles.leftAligned : alignment === "rightAligned" ? styles.rightAligned : styles.centerAligned;

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        {content?.mainTitle && (
          <>
            <Typography variant="h2" className={`${styles.headingPrimary}`}>
              {content?.mainTitle}
            </Typography>
            {!content?.hideUnderline && <div className={`${styles.bar}`}>&nbsp;</div>}
          </>
        )}
        <div className={`${!content?.mainTitle && styles.highlightedText} ${styles.headingSecondary}`}>
          <RichText align="" className={`${styles.desc} ${alignmentClass}`}  text={content?.richText} />
        </div>
      </div>
      {cta && cta?.label && (
        <div className={styles.btnContainer}>
          <Button
            className={styles.cta}
            isLink={true}
            link={cta?.url}
            title={cta?.label}
            color={cta?.color}
            type={cta?.type}
            new_tab={cta?.isNewTab}
          />
        </div>
      )}
    </div>
  );
};

export default DefaultContentBlock;
