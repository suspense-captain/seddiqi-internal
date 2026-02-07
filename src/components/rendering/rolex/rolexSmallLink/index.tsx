import GreenArrowSmall from "@assets/images/svg/GreenArrowSmall";
import React, { useContext } from "react";
import styles from "./rolexSmallLink.module.scss";
import { RolexContext } from "@contexts/rolexContext";

const RolexSmallLink = ({ href, className, linkText }) => {
  if (!linkText) return null;
  const { updateRolexContact } = useContext(RolexContext);
  
  const handleClick = () => {
    updateRolexContact(true);
  };

  if (href === "/contact-us") {
    return (
      <div onClick={() => handleClick()} className={`${styles.rolexLink} ${className}`}>
        <span>{linkText}</span> <GreenArrowSmall />
      </div>
    );
  }

  return (
    <a href={href} className={`${styles.rolexLink} ${className}`}>
      <span>{linkText}</span> <GreenArrowSmall />
    </a>
  );
};

export default RolexSmallLink;
