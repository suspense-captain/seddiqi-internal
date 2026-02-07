import React from "react";
import Image from "@components/module/image";
import { Button, ContentHeader, Typography, Video } from "@components/module";
import styles from "./titleAndTwoBlockImageContentOverlap.module.scss";
import RichText from "@components/module/richText";

const ImageComponent = ({ image, alt }) => (
  <Image
    className={styles.image}
    height={styles.image}
    image={image}
    imageAltText={alt}
    poiAspect={{sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1"}}
    // query={"h=700"}
  />
);

const TitleAndTwoBlockImageContentOverlap = ({
  contentLeft,
  contentRight,
  ...content
}) => {
  if (!contentLeft?.media?.image || !contentRight?.media?.image) return null;
  const cta = contentRight?.cta;
  const articleLeft = contentLeft?.articleLeft;
  const articleRight = contentRight?.articleRight;
  const articleLeftCta = articleLeft?.cta;
  const articleRightCta = articleRight?.cta;

  return (
    <div className={styles.container}>
      <div className={styles.columnOne}>
        <div className={styles.textsContainer}>
          <Typography variant="p" className={styles.label}>
            {contentLeft?.label}
          </Typography>
          <ContentHeader
            barColor={styles.barColor}
            subTitleColor={styles.subTitleColor}
            titleColor={styles.titleColor}
            hideUnderline={contentLeft?.hideUnderline}
            mainTitle={contentLeft?.heading}
            richText={contentLeft?.description}
          />
        </div>
        <div className={styles.imageCardContainer}>
          {contentLeft?.media?.image ? (
            <ImageComponent image={contentLeft?.media?.image} alt="image" />
          ) : (
            <Video
              className={styles.image}
              video={contentLeft?.media?.video}
              autoPlay={contentLeft?.media?.autoPlay}
              showPlay={contentLeft?.media?.showPlay}
            />
          )}
          <div className={styles.heritageCardColumnOne}>
            <div className={styles.heritageArticleCardContainer}>
              {articleLeft.label && (
                <Typography variant="p" className={styles.articleDate}>
                  {articleLeft.label}
                </Typography>
              )}
              {articleLeft.title && (
                <Typography variant="h4" className={styles.articleTitle}>
                  {articleLeft.title}
                </Typography>
              )}
              {articleLeft.description && (
                <Typography variant="p" className={styles.articleDescription}>
                  {articleLeft.description}
                </Typography>
              )}
              {articleLeftCta &&
                articleLeftCta?.label &&
                articleLeftCta?.label?.length > 0 && (
                  <Button
                    isLink={true}
                    link={articleLeftCta?.url}
                    className={styles.articleLeftCta}
                    title={articleLeftCta?.label}
                    color={articleLeftCta?.color}
                    type={articleLeftCta?.type}
                    new_tab={articleLeftCta?.isNewTab}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.columnTwo}>
        <div className={styles.imageCardContainer}>
          {contentRight?.media?.image ? (
            <ImageComponent image={contentRight?.media?.image} alt="image" />
          ) : (
            <Video
              className={styles.image}
              video={contentRight?.media?.video}
              autoPlay={contentRight?.media?.autoPlay}
              showPlay={contentRight?.media?.showPlay}
            />
          )}
          <div className={styles.heritageCardColumnTwo}>
            <div className={styles.heritageArticleCardContainer}>
              {articleRight.label && (
                <Typography variant="p" className={styles.articleDate}>
                  {articleRight.label}
                </Typography>
              )}
              {articleRight.title && (
                <Typography variant="h4" className={styles.articleTitle}>
                  {articleRight.title}
                </Typography>
              )}
              {articleRight.description && (
                <Typography variant="p" className={styles.articleDescription}>
                  {articleRight.description}
                </Typography>
              )}

              {articleRightCta &&
                articleRightCta?.label &&
                cta?.label?.length > 0 && (
                  <Button
                    isLink={true}
                    link={articleRightCta?.url}
                    className={styles.articleRightCta}
                    title={articleRightCta?.label}
                    color={articleRightCta?.color}
                    type={articleRightCta?.type}
                    new_tab={articleRightCta?.isNewTab}
                  />
                )}
            </div>
          </div>
        </div>
        <div className={styles.columnContent}>
          <div className={styles.headingSecondary}>
            <RichText
              align=""
              className={styles.desc}
              text={contentRight?.description}
            />
          </div>
          {cta && cta?.label && cta?.label?.length > 0 && (
            <Button
              isLink={true}
              link={cta?.url}
              className={styles.discoverBtn}
              title={cta?.label}
              color={cta?.color}
              type={cta?.type}
              new_tab={cta?.isNewTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleAndTwoBlockImageContentOverlap;
