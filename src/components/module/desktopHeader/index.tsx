import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "@contexts/headerContext";
import MegaMenu from "../megaMenu";
import HeaderMainLinks from "../headerMainLinks";
import styles from "./header.module.scss";
import Image from "@components/module/image";;
import Link from "next/link";

const LogoLink = ({ logo, className }) => {
  if (!logo) return null;
  return (
    <Link key={logo?.altText} href={logo?.url || "/"} style={{ margin: 0, padding: 0 }}>
      <Image image={logo?.image} className={className} imageAltText={logo?.altText} />
    </Link>
  );
};

export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { headerData, updateCurrent } = useContext(HeaderContext);

  // const { mainLogo } = headerData?.content;
  const mainLogo = headerData?.content?.mainLogo
  

  // MAKE SMALL HEADER ON SCROLL
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerScrollStyles = `${styles.headerContainer} ${scrolled && styles.scrolled}`;

  if(scrolled){
    document.body.classList.add("scrolledPadding");
  }
  else{
    document.body.classList.remove("scrolledPadding");
  }

  return (
    <div onMouseLeave={() => updateCurrent(null)} className={styles.desktopHeader}>
      <div className={headerScrollStyles}>
        <MegaMenu headerHeightClass={styles.headerHeight} />
        <div className={`${scrolled && styles.headerScrolled} ${styles.headerMargin}`}>
          {mainLogo && (
            <div onMouseEnter={() => updateCurrent(null)} className={styles.headerLogoContainer}>
              <LogoLink logo={mainLogo?.image} className={styles.mainLogo} />
            </div>
          )}
          <HeaderMainLinks isScrolled={scrolled} />
        </div>
      </div>
    </div>
  );
}
