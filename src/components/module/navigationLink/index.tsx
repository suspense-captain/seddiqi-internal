import ArrowRight from "@assets/images/svg/ArrowRight";
import Link from "next/link";
import React from "react";
import styles from "./navigationLink.module.scss";
import { NavigationLinkProps } from "@utils/models";

const NavigationLink: React.FC<NavigationLinkProps> = ({
  url,
  title,
  className,
  arrow,
  hover = true,
  isNewTab = false,   
}) => {
  if (url) {
    return (
      <Link
        className={`${hover && styles.navigationLink} ${className}`}
        href={url || "/"}
        target={isNewTab ? "_blank" : "_self"}
        rel={isNewTab ? "noopener noreferrer" : ""}
      >
        <span>{title}</span>
        {arrow && <ArrowRight />}
      </Link>
    );
  } else {
    return (
      <div className={`${hover && styles.navigationLink} ${className}`}>
        <span>{title}</span>
      </div>
    );
  }
};

export default NavigationLink;
