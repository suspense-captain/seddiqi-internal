import { ContentHeader, Image, Video } from "@components/module";
import React from "react";
import styles from "./contentAndSingleImageColumn.module.scss";

const ContentAndSingleImageColumn = ({ ...content }) => {

  const poiAspect = {sm: "1:1", md: "1:1", lg: "1:1", xl: "1:1", }

  return (
    <div className={`${styles.container} ${content?.backgroundColor}`}>
      <ContentHeader
        mainTitle={content?.mainTitle}
        richText={content?.richText}
        hideUnderline={content?.hideUnderline}
      />
      {content?.media?.image ? (
        <Image height={styles.image} className={styles.image} image={content?.media?.image} poiAspect={poiAspect}/>
      ) : (
        <Video className={styles.image} video={content?.media?.video} />
      )}
    </div>
  );
};

export default ContentAndSingleImageColumn;
