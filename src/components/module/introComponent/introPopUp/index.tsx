import React, { useState } from "react";
import styles from "./introPopUp.module.scss";
import {
  Button,
  GradientOverlay,
  Image,
  Typography,
  Video,
} from "@components/module";
import { CloseIconV2 } from "@assets/images/svg";
import RichText from "@components/module/richText";

const IntroPopUp = ({ imageInfo, setImageInfo }) => {
  const onlyMedia = !imageInfo?.title && !imageInfo?.description;
  const mediaClass = `${styles.image} ${onlyMedia ? styles.imgFull : ""}`;
  const image2Class = styles.image2;
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);


  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div onClick={() => setImageInfo(null)} className={styles.closeIcon}>
          <CloseIconV2 />
        </div>

        {imageInfo?.media?.image ? (
          <GradientOverlay className={mediaClass} opacity={60}>
            <Image
              className={`${mediaClass} ${image2Class}`}
              image={imageInfo?.media?.image}
              imageAltText={"image text"}
            />
          </GradientOverlay>
        ) : (
          <GradientOverlay className={mediaClass} opacity={60}>
            <Video
              autoPlay={imageInfo?.media?.autoPlay}
              showPlay={imageInfo?.media?.showPlay}
              className={mediaClass}
              video={imageInfo?.media?.video}
            />
          </GradientOverlay>
        )}

        {(imageInfo?.title || imageInfo?.description) && (
          <div className={styles.textContainer}>
            <Typography className={styles.title} variant="h2">
              {imageInfo?.title}
            </Typography>
             <div
              className={`${styles.descriptionWrapper} ${
                expanded ? styles.expanded : ""
              }`}
              onClick={toggleExpand}
            >
            <RichText
              className={styles.description}
              text={imageInfo?.description}
            />
            {!expanded && <div className={styles.ellipsisOverlay} />}
             </div>
            {imageInfo?.cta && (
              <Button
                isLink={true}
                link={imageInfo?.cta?.url}
                className={styles.cta}
                title={imageInfo?.cta?.label}
                color={imageInfo?.cta?.color}
                type={imageInfo?.cta?.type}
                new_tab={imageInfo?.cta?.isNewTab}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroPopUp;
