import { Image } from "@components/module";
import styles from "./imageTextWithVariations.module.scss";
import { NavigationLink } from "@components/module";
import Typography from "@components/module/typography";
import RichText from "@components/module/richText";

const ImageTextWithVariations = ({ ...content }) => {
  if (!content) return null;

  const topContents = content?.topContents && content?.topContents[0];
  const bottomContents = content?.bottomContents && content?.bottomContents[0];

  const desktopImage = content?.images?.desktop?.media || null;
  const mobileImage = content?.images?.mobile?.media || null;

  const desktopOrientationClass =
    content?.images?.desktop?.imageOrientations?.toLowerCase() || "landscape";
    
  const hasMobileImage = !!mobileImage;

  const backgroundClass = content?.backgroundColor?.toLowerCase();

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  return (
    <div className={`${[styles.container]} ${styles[backgroundClass]}`}>

      {topContents && 
        <div className={styles.topContents}>

        {topContents.media &&
          <div className={styles.logoContainer}>
            <Image
              imgWidth="auto"
              height={"auto"}
              image={topContents.media?.image}
              imageAltText={topContents.media?.altText}
            />  
          </div>
        }

        {topContents.topTitle &&
          <Typography variant="h2">
            {topContents.topTitle}
          </Typography>
        }

        {topContents.topDescription &&
          <RichText align="" text={topContents.topDescription} />
        }
      
        {topContents.topCtaText &&
          <div className={styles.btnContainer}>
            <NavigationLink
              className={styles.ctaButton}
              title={topContents.topCtaText}
              isNewTab={false}
              url={topContents.topCtaLink}
            />
          </div>
        }
        </div>
      }

      {!hasMobileImage && desktopImage && (
        <div
          className={`${styles.imageContainer} ${styles[desktopOrientationClass]}`}
        >
          <Image
            imgWidth="auto"
            height="auto"
            image={desktopImage.image}
            imageAltText={desktopImage.altText}
            poiAspect={poiAspect}
          />
        </div>
      )}

      {hasMobileImage && desktopImage && (
        <>
          <div
            className={`${styles.imageContainer} ${styles.desktopOnly} ${styles[desktopOrientationClass]}`}
          >
            <Image
              imgWidth="auto"
              height="auto"
              image={desktopImage.image}
              imageAltText={desktopImage.altText}
              poiAspect={poiAspect}
            />
          </div>

          <div
            className={`${styles.imageContainer} ${styles.mobileOnly}`}
          >
            <Image
              imgWidth="auto"
              height="auto"
              image={mobileImage.image}
              imageAltText={mobileImage.altText}
              poiAspect={poiAspect}
            />
          </div>
        </>
      )}

    {hasMobileImage && !desktopImage && (
        <div className={`${styles.imageContainer} ${styles.mobileOnly}`}>
          <Image
            imgWidth="auto"
            height="auto"
            image={mobileImage?.image}
            imageAltText={mobileImage?.altText}
            poiAspect={poiAspect}
          />
        </div>
      )}

    {bottomContents && 
      <div className={styles.bottomContents}>

        {bottomContents.media &&
          <div className={styles.logoContainer}>
            <Image
              imgWidth="auto"
              height={"auto"}
              image={bottomContents.media?.image}
              imageAltText={bottomContents.media?.altText}
              poiAspect={poiAspect}
            />  
          </div>
        }
        
        {bottomContents.bottomTitle &&
          <Typography variant="h2">
            {bottomContents.bottomTitle}
          </Typography>
        }

        {bottomContents.bottomDescription &&
          <RichText align="" text={bottomContents.bottomDescription} />
        }

        {bottomContents.bottomCtaText &&
          <div className={styles.btnContainer}>
            <NavigationLink
              className={styles.ctaButton}
              title={bottomContents.bottomCtaText}
              isNewTab={false}
              url={bottomContents.bottomCtaLink}
            />
          </div>
        }
      </div>
      }
    </div>
  );
};

export default ImageTextWithVariations;
