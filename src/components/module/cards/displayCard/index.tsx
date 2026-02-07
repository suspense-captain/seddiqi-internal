import React, { useContext } from "react";
import Image from "@components/module/image";
import styles from "./displayCard.module.scss";
import { CardInfoProps } from "@utils/models";
import Typography from "@components/module/typography";
import Link from "next/link";
import { HeaderContext } from "@contexts/headerContext";

const DisplayCard: React.FC<CardInfoProps> = ({ item }) => {
  if (!item) return null;
  const image = item?.image?.image;
  const title = item?.title;
  const subtitle = item?.subTitle;
  const link = item?.link ? item?.link : "/";

  if (!image && !title && !subtitle) return null;
  const headerContext = useContext(HeaderContext);
  const { setMenuOpen, updateCurrent } = headerContext;

  return (
    <Link
      onClick={() => {
        setMenuOpen(false);
        updateCurrent(null);
      }}
      href={link}
    >
      <div className={styles.displayCard}>
        {image && (
          <div className={styles.imgContainer}>
            <Image className={styles.storyImg} image={image} imageAltText={item?.image?.altText} />
          </div>
        )}

        <div className={styles.displayCardInfo}>
          {title && (
            <Typography align="left" variant="span" className={styles.title}>
              {title}
            </Typography>
          )}
          {subtitle && <div className={styles.subTitle}>{subtitle}</div>}
        </div>
      </div>
    </Link>
  );
};

export default DisplayCard;
