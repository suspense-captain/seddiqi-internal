import React, { useContext } from "react";
import styles from "./headerFooter.module.scss";
import NavigationLink from "@components/module/navigationLink";
import { HeaderContext } from "@contexts/headerContext";

// const footerLinks = [
//   { id: 1, title: "Contact", url: "/contact" },
//   { id: 2, title: "Store locator", url: "/store-locator" },
//   { id: 3, title: "About Us", url: "/about-us" },
// ];

const HeaderFooter = ({ className }: { className?: any }) => {
  const { headerData, setMenuOpen } = useContext(HeaderContext) || {};
  const footerLinks = headerData?.content?.hygieneLinks;

  if (!footerLinks) return null;
  const headerContext = useContext(HeaderContext);
  const { updateCurrent } = headerContext;
  return (
    <div className={`${className} ${styles.container}`}>
      {footerLinks?.map((item, index) => (
        <div key={index} onClick={() => {
          updateCurrent(null)
          setMenuOpen(false)
        }}>
          <NavigationLink
            hover={true}
            className={styles.footerNavigation}
            title={item.title}
            key={item.title}
            url={item.url}
          />
        </div>
      ))}
    </div>
  );
};

export default HeaderFooter;
