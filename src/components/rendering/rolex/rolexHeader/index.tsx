import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import styles from "./rolexHeader.module.scss";
import Link from "next/link";
import { ArrowDown } from "@assets/images/svg";
import { useWindowWidth } from "@utils/useCustomHooks";
import { Image, NavigationLink } from "@components/module";
import { useRouter } from "next/router";
import { RolexContext } from "@contexts/rolexContext";
import classNames from "classnames";
import RolexBreadCumbs from "../rolexBreadCrumbs";

const RolexNavbar = ({ className = "", storeName = "", ...content }) => {
  if (!content) return null;
  const contentToUse = content.content || content;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(0);
  const [isClient, setIsClient] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const windowWidth = useWindowWidth();
  const {
    backgroundColor: type,
    navLinks: links,
    logo,
    cta,
  } = contentToUse || {};
  const screenSize = type === "green" ? 1250 : 1110;

  const isBlack = type === "black";
  const isGreen = type === "green";
  const isWhite = type === "white";

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (dropdownRef.current && isDropdownOpen) {
      setHeight(dropdownRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isDropdownOpen]);
  
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  if (!isClient) return null;
  const router = useRouter();
  const { rolexContact, updateRolexContact, setRolexCPOContact } = useContext(RolexContext);
  
   const handleContactClick = (e) => {
    e.preventDefault();
    const isThankYouPage = router.pathname.includes('thank-you');
    const targetPath = isGreen ? '/rolex' : '/rolex/cpo';
    
    if (isThankYouPage || router.pathname !== targetPath) { 
      router.push(targetPath).then(() => {
        updateRolexContact(true);
      });
    } else {
      updateRolexContact(true);
    }
    
    if (!isGreen) {
      window?.scrollTo(0, 0);
    }
  };

  return (
    <div className={classNames(styles.container, "rolex")}>
      <nav
        className={[
          scrolled && styles.scrolled,
          isWhite && styles.whiteBg,
          isBlack && styles.blackBg,
          styles.rolexNavbar,
          styles[className],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link href={isGreen ? "/rolex" : "/rolex/cpo"}>
          <Image
            className={isGreen ? styles.rolexLogo : styles.rolexLogoBlack}
            height={isGreen ? styles.rolexLogo : styles.rolexLogoBlack}
            image={logo?.image}
            imageAltText={logo?.altText}
          />
        </Link>

        {windowWidth > screenSize ? (
          <>
            <ul className={`${styles.navbarGreenLinks} ${styles.navbarLinks}`}>
              {links?.map((link) =>
                link?.label?.toLowerCase() !== "contact us" ? (
                  <>
                    {link?.label && (
                      <li
                        onClick={() => {
                          if (isGreen) {
                            updateRolexContact(false);
                          } else {
                            updateRolexContact(false);
                          }
                        }}
                        key={link?.label}
                      >
                        <NavigationLink
                          className={`${isWhite && styles.navBlack} ${
                            styles.navLink
                          }`}
                          title={link?.label}
                          isNewTab={link?.isNewTab}
                          url={link?.url}
                        />
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    {link?.label && (
                      <li
                        onClick={handleContactClick}
                        key={link?.label}
                      >
                        <Link
                          onClick={(e) => e.preventDefault()}
                          href={"/"}
                          className={`${isWhite && styles.navBlack} ${
                            styles.navLink
                          }`}
                        >
                          <span>{link?.label}</span>
                        </Link>
                      </li>
                    )}
                  </>
                )
              )}
            </ul>
            {/* <div className={styles.contactButton}>
              <NavigationLink
                className={`${isWhite && styles.btnGreen} ${styles.btnWhite}`}
                title={cta?.label}
                isNewTab={cta?.isNewTab}
                url={cta?.url}
              />
            </div> */}
          </>
        ) : (
          <div className={styles.dropdownContainer} onClick={toggleDropdown}>
            <div
              className={`${(isGreen || isBlack) && styles.menuWhite} ${
                styles.menu
              }`}
            >
              Menu
            </div>
            <ArrowDown
              fill={isGreen || isBlack ? "white" : "black"}
              className={isDropdownOpen ? styles.activeArrow : ""}
            />
          </div>
        )}

        {windowWidth < screenSize && (
          <ul
            ref={dropdownRef}
            className={`${
              isGreen || isBlack
                ? styles.navbarMobileGreenLinks
                : styles.navbarMobileLinks
            } ${isBlack ? styles.blackBg : ""}`}
            style={{
              height: isDropdownOpen ? height : 0,
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            {links?.map((link, index) =>
              link?.label?.toLowerCase() !== "contact us" ? (
                <>
                  {link?.label && (
                    <li
                      onClick={() => {
                        if (isGreen) {
                          updateRolexContact(false);
                        } else {
                          updateRolexContact(false);
                        }
                      }}
                      key={index}
                    >
                      <NavigationLink
                        className={`${isWhite && styles.navMobileBlack} ${
                          styles.navMobileLink
                        }`}
                        title={link?.label}
                        isNewTab={link?.isNewTab}
                        url={link?.url}
                      />
                    </li>
                  )}
                </>
              ) : (
                <>
                  {link?.label && (
                    <li
                      onClick={handleContactClick}
                      key={index}
                    >
                      <div
                        className={`${isWhite && styles.navMobileBlack} ${
                          styles.navMobileLink
                        }`}
                      >
                        <span>{link?.label}</span>
                      </div>
                    </li>
                  )}
                </>
              )
            )}

            {/* <li>
              <NavigationLink
                className={`${isWhite && styles.navMobileBlack} ${styles.navMobileLink}`}
                title={cta?.label}
                isNewTab={cta?.isNewTab}
                url={cta?.url}
              />
            </li> */}
          </ul>
        )}

        <RolexBreadCumbs type={type} storeName={storeName} />
      </nav>
    </div>
  );
};

export default RolexNavbar;
