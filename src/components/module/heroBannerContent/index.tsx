import { Button, Typography } from "@components/module";
import styles from './heroBannerContent.module.scss'
import RichText from "@components/module/richText";
import { BannerContentProps } from "@utils/models/heroBanner";
import { constructAmplienceImageUrl } from "@utils/helpers/constructAmplienceImageUrl";


const HeroBannerContent: React.FC<BannerContentProps> = ({
    activeBanner,
    alignmentClass,
    contentAlign,
    isRolex,
    isCenter,
  }) => {
    if (!activeBanner) {
      return null;
    }    
  
    return (
      <div className={`${styles.bannerItem}`}>
        <div
          className={`${styles.textContainer} ${styles[alignmentClass]} ${
            activeBanner?.verticalAlignment === "bottom" ? styles.bottomPadding : ""
          }`}
        >
          { activeBanner?.logoIcon && activeBanner?.logoIcon.image && (
            <div className={styles.logo}>
              <img
                className={styles.logoIcon}
                src={constructAmplienceImageUrl(activeBanner?.logoIcon?.image?.image)}
                alt={activeBanner?.logoIcon?.altText}
              />
            </div>
          )}
  
          {activeBanner?.mainTitle && (
            <Typography align={contentAlign} variant="h1" className={`${isRolex && styles.rolexTitle} ${styles.title}`}>
              {activeBanner?.mainTitle}
            </Typography>
          )}
          {!isRolex && activeBanner?.mainTitle && !activeBanner?.hideUnderline && (
            <div className={`${!isCenter && styles.underlineConainerAlignment} ${styles.underlineConainer}`}>
              <div className={styles.underline}></div>
            </div>
          )}
          {activeBanner?.richText && (
            <RichText
              align={contentAlign}
              className={`${isRolex && styles.rolexDescription} ${styles.description}`}
              text={activeBanner.richText}
            />
          )}
  
          {activeBanner?.cta &&
            activeBanner?.cta?.length > 0 &&
            activeBanner?.cta.map(
              (_cta: any, index) =>
                _cta.label &&
                _cta.label.length > 0 && (
                  <div key={index}>
                    <div className={`${styles.ctaButtonLeft} ${styles.ctaButton}`}>
                      <Button
                        isLink={true}
                        link={_cta?.url}
                        title={_cta?.label}
                        new_tab={_cta?.isNewTab}
                        type={`${_cta?.type?.toLowerCase()} ${_cta.color?.toLowerCase()}`}
                        rolexClass={isRolex && "rolex-small-button"}
                      />
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    );
};


export default HeroBannerContent;
