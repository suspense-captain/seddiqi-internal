import React from "react";
import styles from "./heritageContentComponent.module.scss";
import Typography from "../../module/typography";
import RichText from "../../module/richText";
import { GradientOverlay, Image } from "@components/module";
import Video from "@components/module/video";
import Button from "../../module/button";
import { HeritageContentProps } from "@utils/models";
import Link from "next/link";
import { title } from "process";

const HeritageContentComponent: React.FC<HeritageContentProps> = ({
  media,
  mainTitle,
  description,
  label,
  featuredTitle,
  link,
  imagePosition,
  textAlignment,
  opacity,
  ...content
}) => {

  let backgroundColor = "primary";
  const bgClass =
    backgroundColor === "primary"
      ? styles.primaryBackground
      : backgroundColor === "secondary"
      ? styles.secondaryBackground
      : styles.defaultBackground;

  const poiAspect = { sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1" };

  const ContentBlock = () => (
    <div className={`${styles.heritageContnetContainer} ${bgClass}`}>
      <div
        className={`${
          imagePosition && imagePosition === "Right" && styles.imagePosition
        } ${styles.innerContainer}`}
      >
        {media && (
          <div className={styles.mediaContainer}>
            <GradientOverlay
              className={styles.gradient}
              opacity={opacity?.opacity}
            >
              {media?.image ? (
                <Image
                  className={styles.image}
                  image={media.image}
                  imageAltText={media.altText}
                  poiAspect={poiAspect}
                />
              ) : media?.video ? (
                <Video
                  video={media.video}
                  autoPlay={media.autoPlay}
                  showPlay={media.showPlay}
                />
              ) : null}
            </GradientOverlay>
          </div>
        )}

        <div
          className={`${textAlignment === "Left" && styles.leftAlignment} ${
            textAlignment === "Right" && styles.rightAlignment
          } ${textAlignment === "Center" && styles.centerAlignment} ${
            styles.contentContainer
          }`}
        >
          {mainTitle && (
            <Typography variant="h2" className={styles.title}>
              {mainTitle}
            </Typography>
          )}

          <div className={styles.discContainer}>
            {label && <div className={styles.labelCopy}>{label}</div>}
            {featuredTitle && (
              <div className={styles.featuredTitle}>{featuredTitle}</div>
            )}
            {description && (
              <RichText
                className={`${
                  textAlignment === "Left" && styles.leftRichAlignment
                } ${textAlignment === "Right" && styles.rightRichAlignment} ${
                  textAlignment === "Center" && styles.centerRichAlignment
                } ${styles.richTextContainer}`}
                align=""
                text={description}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {link !== "/" ? (
        <Link href={link}>
          <div className={`${styles.heritageContnetContainer} ${bgClass}`}>
            <ContentBlock />
          </div>
        </Link>
      ) : (
        <div className={`${styles.heritageContnetContainer} ${bgClass}`}>
          <ContentBlock />
        </div>
      )}
    </>
  );
};

export default HeritageContentComponent;
