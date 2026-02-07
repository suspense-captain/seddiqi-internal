import React, { useContext, useEffect, useRef,useState } from "react";
import Image from "@components/module/image";
import { AccountIcon, CalendarIcon, MapIcon, PhoneIcon, SearchIcon } from "@assets/images/svg";
import styles from "./MobileHeaderNavbar.module.scss";
import { HeaderContext } from "@contexts/headerContext";
import { MobileHeaderNavbarProps } from "@utils/models";
import Link from "next/link";
import PhoneIconNoBorder from "@assets/images/svg/PhoneIconNoBorder";
import { useSearchContext } from "@contexts/searchContext";
import { Search } from "@components/module";

const MobileHeaderNavbar: React.FC<MobileHeaderNavbarProps> = ({ toggleMenu, menuOpen }) => {
  const { headerData } = useContext(HeaderContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { openSearch } = useSearchContext();

  const openSearchPopup = () => {
    setIsPopupVisible(true);
    openSearch();
  };

  const closeSearchPopup = () => {
    setIsPopupVisible(false);
  };


  if (!headerData) return null;

  return (
    <>
    <header className={styles.mobileHeader}>
      <div className={styles.mobileHeaderContainer}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <div className={`${styles.hamBurger} ${menuOpen ? styles.hamburgerCross : ""}`} />
          <div style={{ visibility: "hidden" }}>
            <MapIcon fill="#" />
          </div>
        </div>
        <Link className={styles.mobileLogoWrap} href={"/"}>
          <Image
            className={styles.centerLogo}
            image={headerData?.content?.logoSymbol?.image?.image}
            imageAltText={"Seddiqi Logo"}
          />
        </Link>
        <div className={styles.rightIcons}>
          {/* <Link target="_blank" href="/book-an-appointment">
            <CalendarIcon fill="#" />
          </Link> */}
          {/* <div onClick={openSearchPopup}>
            <SearchIcon fill="#" />
          </div> */}
          <Link href="/contact-us">
            <PhoneIconNoBorder className={styles.phoneIcon} fill="#" />
          </Link>
          <Link href="/find-a-boutique-listing">
            <MapIcon fill="#" />
          </Link>
          {/* <Link href="/profile">
            <AccountIcon fill="#" />
          </Link> */}
        </div>
      </div>
    </header>
    <div className={`${styles.drawerStyle} ${isPopupVisible ? styles.visible : ""}`}>
    <Search closeSearch={closeSearchPopup}></Search>
  </div>
  </>
  );
};

export default MobileHeaderNavbar;
