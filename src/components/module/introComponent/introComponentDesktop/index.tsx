import React, { useContext, useState } from "react";
import styles from "./introComponentDesktop.module.scss";
import { GradientOverlay, Image, Typography, Video } from "@components/module";
import IntroPopUp from "../introPopUp";
import SearchPopUp from "../searchPopUp";
import SearchInputField from "../searchInputField";
import RichText from "@components/module/richText";
import { LanguageContext } from "@contexts/languageContext";
import { introAndExplore } from "@utils/data/english-arabic-static-data";

const IntroComponentDesktop = ({ content }) => {
  const [imageInfo, setImageInfo] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMouseMove = (e) => {
    const container = document.getElementById("parallex");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const xInside = e.clientX - rect.left;
    const yInside = e.clientY - rect.top;
    const offset = 50;

    const panX = xInside < rect.width / 2 ? offset : -offset;
    const panY = yInside < rect.height / 2 ? offset : -offset;

    container.style.transform = `translate(${panX}px, ${panY}px)`;
  };

  const handleMouseLeave = () => {
    const container = document.getElementById("parallex");
    if (container) container.style.transform = "translate(0px, 0px)";
  };

  if (imageInfo) {
    return <IntroPopUp imageInfo={imageInfo} setImageInfo={setImageInfo} />;
  }
  if (searchOpen) {
    return (
      <SearchPopUp
        content={content?.searchList}
        setSearchOpen={setSearchOpen}
      />
    );
  }

  const { language } = useContext(LanguageContext)


  const renderMediaComponent = (content, heightClass, imageClass) => {
    if (content?.media?.image) {
      return (
        <div className={`${heightClass}`}>
          <div
            onClick={() =>
              setImageInfo({
                ...content,
              })
            }
            className={styles.exploreContainer}
          >
            <div className={styles.exploreBtn}>{introAndExplore[language]?.explore}</div>
          </div>
          <GradientOverlay
            className={imageClass}
            opacity={content?.opacity?.opacity}
          >
            <Image
              className={styles.image}
              height={imageClass}
              image={content?.media?.image}
              imageAltText={"image text"}
            />
          </GradientOverlay>
        </div>
      );
    } else {
      return (
        <div className={`${heightClass}`}>
          <div
            onClick={() =>
              setImageInfo({
                ...content,
              })
            }
            className={styles.exploreContainer}
          >
            <div className={styles.exploreBtn}>{introAndExplore[language]?.explore}</div>
          </div>
          <GradientOverlay
            className={imageClass}
            opacity={content?.opacity?.opacity}
          >
            <Video
              className={`${imageClass} ${styles.image}`}
              video={content?.media?.video}
              autoPlay={content?.media?.autoPlay}
              showPlay={content?.media?.showPlay}
            />
          </GradientOverlay>
        </div>
      );
    }
  };

  return (
    <div className={styles.introContainer}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={styles.titleSection}
      >
        {content?.mainTitle && (
          <Typography className={styles.heading} variant="h1">
            {content?.mainTitle}
          </Typography>
        )}
        {content?.description && (
          <RichText
            align="center"
            className={styles.description}
            text={content?.description}
          />
        )}
      </div>

      <SearchInputField placeholder={introAndExplore[language]?.searchText} setSearchOpen={setSearchOpen} />

      <div
        id="parallex"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={styles.container}
      >
        {renderMediaComponent(
          content?.topLeftItem,
          styles.image1,
          styles.imageClass
        )}
        {renderMediaComponent(
          content?.topMiddleItem,
          styles.image2,
          styles.imageClass
        )}
        {renderMediaComponent(
          content?.topRightItem,
          styles.image3,
          styles.imageClass
        )}
        {renderMediaComponent(
          content?.bottomLeftItem,
          styles.image4,
          styles.imageClass
        )}
        {renderMediaComponent(
          content?.bottomMiddleItem,
          styles.image5,
          styles.imageClass
        )}
        {renderMediaComponent(
          content?.bottomRightItem,
          styles.image6,
          styles.imageClass
        )}
      </div>
    </div>
  );
};

export default IntroComponentDesktop;
