import { useContext, useState } from "react";
import styles from "./headerMainLinks.module.scss";
import { HeaderContext } from "@contexts/headerContext";
import NavigationLink from "../navigationLink";
import {
  AccountIcon,
  CalendarIcon,
  SearchIcon,
  WishlistIcon,
  MapIcon,
  PhoneIcon,
} from "@assets/images/svg";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import Link from "next/link";
import Image from "next/image";
import { SideDrawer } from "@components/module";
import { Search } from "@components/module";
import { SearchContext, useSearchContext } from "@contexts/searchContext";
import classNames from "classnames";
import PhoneIconNoBorder from "@assets/images/svg/PhoneIconNoBorder";

const HeaderMainLinks = ({ isScrolled = false }: { isScrolled?: boolean }) => {
  const { updateCurrent, current, headerData } = useContext(HeaderContext);
  const { closeSearch } = useContext(SearchContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { openSearch } = useSearchContext();
  const headerMainLinks = headerData?.children;
  if (!headerMainLinks) return null;

  const openSearchPopup = () => {
    setIsPopupVisible(true);
    openSearch();
  };

  const closeSearchPopup = () => {
    setIsPopupVisible(false);
    closeSearch();
  };

  const RolexScript = `<div id="rolex-retailer-clock"><div class="LinkEnabler" style="position:absolute; height:70px; width:150px; z-index:1;"></div><iframe id="rolex_retailer" title="Rolex Official Retailer" src="https://static.rolex.com/retailers/clock/?colour=gold&amp;apiKey=fd5d8663fc8674a9ffab32649c3e39bf&amp;lang=en" style="width:150px;height:70px;border:0;margin:0;padding:0;overflow:hidden;z-index:0;position:relative;scroll:none" scrolling="NO" frameborder="NO"></iframe></div>`;

  const PATEK_LOGO = "/images/patek-philippe-authorised-retailer.webp";

  return (
    <div className={styles.linksContainer}>
       <div
          className={classNames(styles.logoContainer, {
            [styles.scrolled]: isScrolled,
          })}
        >
          {headerData?.content?.rolexLogo && (
            <Link
              href={headerData?.content?.rolexLogo}
              dangerouslySetInnerHTML={{ __html: RolexScript }}
            ></Link>
          )}

          {headerData?.content?.patekLogo && (
            <Link href={headerData?.content?.patekLogo}>
              <Image
                className={styles.patekLogo}
                src={PATEK_LOGO}
                width={116}
                height={68}
                alt="patek logo"
              />
            </Link>
          )}
        </div>

      <div className={styles.links}>
        {headerMainLinks?.map((item, ind) => (
          <div key={generateUniqueId()} onMouseEnter={() => updateCurrent(ind)}>
            <NavigationLink
              hover={false}
              className={styles.headerLink}
              title={item?.content?.commonProps?.item_title}
              url={item?.content?.commonProps?.url}
              isNewTab={item?.content?.commonProps?.isNewTab}
            />
          </div>
        ))}
      </div>
      <div className={styles.navIcons}>
        {/* <div onClick={openSearchPopup}>
          <SearchIcon fill="#" />
        </div> */}
        {/* <Link target="_blank" href="/book-an-appointment">
          <CalendarIcon fill="#" />
        </Link> */}
        <Link href="/contact-us">
          <PhoneIconNoBorder className={styles.phoneIcon} fill="#" />
        </Link>
        <Link href="/find-a-boutique-listing">
          <MapIcon fill="#" />
        </Link>
        {/* <Link href="/profile">
          <AccountIcon fill="#" />
        </Link> */}
        {/* <WishlistIcon fill="#" /> */}
      </div>
      <div
        className={`${styles.drawerStyle} ${
          isPopupVisible ? styles.visible : ""
        }`}
      >
        <Search closeSearch={closeSearchPopup}></Search>
      </div>
    </div>
  );
};

export default HeaderMainLinks;
