import { HeaderContext } from "@contexts/headerContext";
import { useContext } from "react";
import Link from "next/link";
import Image from "@components/module/image";
import styles from "./headerLogoBar.module.scss";

const LogoLink = ({ logo, className }) => {
  if (!logo) return null;
  return (
    <Link key={logo?.altText} href={logo?.url || "/"} style={{ margin: 0, padding: 0 }}>
      <Image image={logo?.image} className={className} imageAltText={logo?.altText} />
    </Link>
  );
};

const HeaderLogoBar = ({ headerLogoContainer }) => {
  const { headerData, updateCurrent } = useContext(HeaderContext);
  const { mainLogo } = headerData?.content;

  return (
    <div className={headerLogoContainer && headerLogoContainer}>
      {/* {leftLogo && <LogoLink logo={leftLogo?.image} className={styles.patakLogo} />} */}
      {mainLogo && <LogoLink logo={mainLogo?.image} className={styles.mainLogo} />}
      {/* {rightLogo && <LogoLink logo={rightLogo?.image} className={styles.rolexLogo} />} */}
    </div>
  );
};

export default HeaderLogoBar;
