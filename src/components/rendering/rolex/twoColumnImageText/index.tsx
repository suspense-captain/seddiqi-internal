import { Image } from "@components/module";
import styles from "./twoColumnImageText.module.scss";
import RichText from "@components/module/richText";

const TwoColumnImageText = ({ ...content }) => {
  if (!content) return null;
  
  const contentRow = content?.row;

  const poiAspect = { sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1" };

  return (
    <div className={styles.container}>
      {contentRow?.map((data, index) => (
        <div key={index} className={`${styles.imageTextsWrapper}`}>
          <Image
            className={styles.image}
            imgWidth="100%"
            height={"auto"}
            image={data.media?.image}
            imageAltText={data.media?.altText}
            poiAspect={poiAspect}
          />

          <div className={styles.textsContainer}>
            <div className={styles.textsContainerInner}>
              {data.logoIcon?.image && (
                <div className={styles.logoContainer}>
                  <Image
                    className={styles.logo}
                    imgWidth="100%"
                    height="auto"
                    image={data?.logoIcon?.image?.image}
                    imageAltText={data?.logoIcon?.image?.altText || "Logo"}
                  />
                </div>
              )}
              {data.subtitle && (
                <h6 className={styles.subtitle}>{data.subtitle}</h6>
              )}
              {data.title && <h3 className={styles.title}>{data.title}</h3>}
              {data?.description && typeof data?.description === "string" && (
                <p className={styles.description}>{data.description}</p>
              )}
              {data?.description &&
                Array.isArray(data?.description) &&
                data?.description?.length > 0 && (
                  <div className={`${styles.headingSecondary}`}>
                    <RichText
                      align=""
                      className={`${styles.description}`}
                      text={data?.description}
                    />
                  </div>
                )}

              <div>
                {data?.linkText && (
                  <a href={data?.linkUrl} className={`${styles.linkText}`}>
                    {data?.linkText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TwoColumnImageText;
