import { Image } from "@components/module";

import styles from "./threeGrid.module.scss";
import GreenArrowSmall from "@assets/images/svg/GreenArrowSmall";
import RolexSmallLink from "../rolexSmallLink";
import RichText from "@components/module/richText";

const ThreeGrid = ({ ...content }) => {
  // if (!content) return null;
  const oneGrid = content?.oneGrid && content?.oneGrid[0];
  const twoGrids = content?.twoGrids && content?.twoGrids[0];

  const backgroundClass = content?.backgroundColor?.toLowerCase();
  const poiAspect = { sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1" };

  return (
    <div className={`${[styles.container]} ${styles[backgroundClass]}`}>
      {oneGrid && (
        <div className={styles.oneGridContainer}>
          {oneGrid?.mainTitle && (
            <h3 className={styles.mainTitle}>{oneGrid?.mainTitle}</h3>
          )}

          <div className={styles.imageTextsWrapper}>
            <div className={`${[styles.imageTextsContainer]}`}>
              {oneGrid?.contents[0]?.media?.image && (
                <a
                  href={oneGrid?.contents[0]?.linkUrl}
                  className={styles.imageContainer}
                >
                  <Image
                    imgWidth="100%"
                    height={"auto"}
                    image={oneGrid?.contents[0]?.media?.image}
                    imageAltText={oneGrid?.contents[0]?.media?.altText}
                  />
                </a>
              )}

              <div className={styles.textsContainer}>
                {oneGrid?.contents[0]?.subtitle && (
                  <p className={styles.subtitle}>
                    {oneGrid?.contents[0]?.subtitle}
                  </p>
                )}
                {oneGrid?.contents[0]?.title && (
                  <h6 className={styles.title}>
                    {oneGrid?.contents[0]?.title}
                  </h6>
                )}

                {oneGrid?.contents[0]?.richText && oneGrid?.contents[0]?.richText[0] &&
                  oneGrid?.contents[0]?.richText[0]?.data && (
                    <div className={styles.headingSecondary}>
                      <RichText
                        align=""
                        className={styles.desc}
                        text={oneGrid?.contents[0]?.richText}
                      />
                    </div>
                  )}

                <div>{oneGrid?.contents[0]?.linkText && (
                  <RolexSmallLink
                    href={oneGrid?.contents[0]?.linkUrl}
                    className={`${[styles.link]} rolex-text-button`}
                    linkText={oneGrid?.contents[0]?.linkText}
                  />
                )}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {twoGrids && (
        <div className={styles.twoGridsContainer}>
          <h3 className={styles.mainTitle}>{twoGrids.mainTitle}</h3>

          <div className={styles.imageTextsWrapper}>
            {twoGrids?.contents?.map((data, index) => (
              <div key={index} className={`${[styles.imageTextsContainer]}`}>
                <a href={data.linkUrl} className={styles.imageContainer}>
                  <Image
                    imgWidth="100%"
                    height={"auto"}
                    image={data.media?.image}
                    imageAltText={data.media?.altText}
                    poiAspect={poiAspect}
                  />
                </a>

                <div className={styles.textsContainer}>
                  <p className={styles.subtitle}>{data.subtitle}</p>
                  <h6 className={styles.title}>{data.title}</h6>
                  {data?.richText && data?.richText[0]?.data && (
                    <div className={styles.headingSecondary}>
                      <RichText
                        align=""
                        className={styles.desc}
                        text={data?.richText}
                      />
                    </div>
                  )}

                  <div>
                  {data?.linkText && (
                    <RolexSmallLink
                      href={data.linkUrl}
                      className={`${[styles.link]} rolex-text-button`}
                      linkText={data.linkText}
                    />
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeGrid;
