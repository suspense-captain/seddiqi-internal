import React, { useContext } from "react";
import Image from "@components/module/image";
import styles from "./storyCard.module.scss";
import { CardInfoProps } from "@utils/models";
import Typography from "@components/module/typography";
import Link from "next/link";
import { HeaderContext } from "@contexts/headerContext";

const StoryCard: React.FC<CardInfoProps> = ({ item, className }) => {
  const image = item?.media?.image || item?.image?.image;
  const altText = item?.media?.altText || item?.image?.altText;
  const title = item?.title;
  const subtitle = item?.subTitle;
  const link = item?.link ? item?.link : "/";

  if (!image || !title || !subtitle) return null;
  const headerContext = useContext(HeaderContext);
  const { setMenuOpen, updateCurrent } = headerContext;
  // const newLink = link.replace("blog/", "");

  // console.log("newLink", newLink)
  const cleanedLink = link.replace(/\/?blog\/?/g, "/blog/");

  return (
    <Link
      onClick={(e) => {
        updateCurrent(null);
        setMenuOpen(false);
      }}
      href={cleanedLink}
    >
      <div className={`${styles.storyCardContainer} ${className}`}>
        <Image className={styles.image} image={image} imageAltText={altText} />
        <div className={styles.content}>
          <Typography variant="span" className={styles.title}>
            {title}
          </Typography>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
