import { Button, ContentHeader, GradientOverlay, Image, Typography, Video } from "@components/module";
import React from "react";
import styles from "./contentAndImageAdvanced.module.scss";
import RichText from "@components/module/richText";

const ContentAndImageAdvanced = ({ ...content }) => {
  const poiAspect = { sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1" };

  const renderTag = () => {
    return (
      content?.tag && (
        <Typography variant="p" className={styles.articleLabel}>
          {content?.tag?.text && <div className={styles.articelbtn}>{content?.tag?.text}</div>}
          {content?.tag?.readTime && <div className={styles.readTime}>{content?.tag?.readTime}</div>}
        </Typography>
      )
    );
  };

  const renderTitle = () => {
    return (
      content?.mainTitle?.text && (
        <Typography variant="h2" className={styles.title}>
          {content?.mainTitle?.text}
        </Typography>
      )
    );
  };

  const renderUnderline = () => {
    return !content?.hideUnderline && <div className={styles.underline}></div>;
  };

  const renderHighlightedText = () => {
    return (
      content?.highlightedText?.text && (
        <Typography variant="p" className={styles.highlight}>
          {content?.highlightedText?.text}
        </Typography>
      )
    );
  };

  const renderRichText = () => {
    return content?.richText && <RichText className={styles.subDescription} align="" text={content?.richText} />;
  };

  const renderByline = () => {
    return (
      content?.byline && (
        <div className={styles.authorDetails}>
          {content?.byline?.author && <span>{content?.byline?.author}</span>}
          {content?.byline?.author && <span className={styles.divider}>|</span>}
          {content?.byline?.date && <span>{content?.byline?.date}</span>}
        </div>
      )
    );
  };

  const renderCTA1 = () => {
    const samePosition =
      content?.cta1?.contentPosition && content?.cta1?.contentPosition === content?.cta2?.contentPosition;

    const extraMarginClass = samePosition && content?.cta1?.contentPosition ? styles.extrMarginBottom : "";

    return (
      content?.cta1?.cta && (
        <div className={`${styles.btnOne} ${extraMarginClass}`}>
          <Button
            isLink={true}
            className={styles.btnStyle}
            title={content?.cta1?.cta?.label}
            color={content?.cta1?.cta?.color}
            type={content?.cta1?.cta?.type}
            new_tab={content?.cta1?.cta?.isNewTab}
          />
        </div>
      )
    );
  };

  const renderCTA2 = () => {
    return (
      content?.cta2?.cta && (
        <div className={styles.btnOne}>
          <Button
            isLink={true}
            className={styles.btnStyle}
            title={content?.cta2?.cta?.label}
            color={content?.cta2?.cta?.color}
            type={content?.cta2?.cta?.type}
            new_tab={content?.cta2?.cta?.isNewTab}
          />
        </div>
      )
    );
  };

  if (!content) {
    return null;
  }

  const mediaClass = `${content?.isMobileSquareImage && styles.square} ${styles.image}`;

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        {content?.tag?.contentPosition === "top" && renderTag()}
        {content?.mainTitle?.contentPosition === "top" && renderTitle()}
        {!content?.hideUnderline && content?.mainTitle?.contentPosition === "top" && renderUnderline()}
        {content?.highlightedText?.contentPosition === "top" && renderHighlightedText()}
        {content?.richTextContentPosition === "top" && renderRichText()}
        {content?.byline?.contentPosition === "top" && renderByline()}
        {content?.cta1?.contentPosition === "top" && renderCTA1()}
        {content?.cta2?.contentPosition === "top" && renderCTA2()}
      </div>

      <div className={styles.imageSection}>
        <GradientOverlay opacity={content?.opacity?.opacity} className={mediaClass}>
          {content?.media?.image ? (
            <Image height={mediaClass} className={mediaClass} image={content?.media?.image} poiAspect={poiAspect} />
          ) : (
            <Video className={mediaClass} video={content?.media?.video} />
          )}
        </GradientOverlay>
      </div>

      <div className={styles.headerSection}>
        {content?.tag?.contentPosition === "bottom" && renderTag()}
        {content?.mainTitle?.contentPosition === "bottom" && renderTitle()}
        {!content?.hideUnderline && content?.mainTitle?.contentPosition === "bottom" && renderUnderline()}
        {content?.highlightedText?.contentPosition === "bottom" && renderHighlightedText()}
        {content?.richTextContentPosition === "bottom" && renderRichText()}
        {content?.byline?.contentPosition === "bottom" && renderByline()}
        {content?.cta1?.contentPosition === "bottom" && renderCTA1()}
        {content?.cta2?.contentPosition === "bottom" && renderCTA2()}
      </div>
    </div>
  );
};

export default ContentAndImageAdvanced;
