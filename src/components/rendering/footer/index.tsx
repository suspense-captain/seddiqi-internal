import React, { useContext } from "react";
import Image from "next/image";
import styles from "./footer.module.scss";
import NavigationLink from "@components/module/navigationLink";
import { TwitterIcon, InstaIcon, FBIcon } from "@assets/images/svg";
import { FooterPropType } from "@utils/models";
import LanguageSelector from "@components/module/languageSelector";
import { useDeviceWidth } from "@utils/useCustomHooks";
import NewsletterSignup from "@components/module/newsletterSignup";
import Link from "next/link";
import { LanguageContext } from "@contexts/languageContext";
import TiktokFooter from "@assets/images/svg/TiktokFooter";

const getLogoUrl = (logoData) => {
  if (logoData?.image) {
    const { defaultHost, endpoint, name } = logoData.image;
    return `https://${defaultHost}/i/${endpoint}/${name}`;
  }
  return "/images/Seddiqi-Logo-Text-Only.svg";
};

const renderLinks = (links, offset, className) => {
  return links
    .slice(offset, offset + 4)
    .map((link) => (
      <NavigationLink
        key={link.content._meta.deliveryId}
        title={link.content.link.label}
        url={link.content.link.url}
        isNewTab={link.content.link.isNewTab}
        className={className}
      />
    ));
};

export default function Footer({ footerData }: FooterPropType) {
  const isDesktop = useDeviceWidth()[0];
  const { language } = useContext(LanguageContext);

  const mainLinks =
    footerData?.children?.filter((child) => child.content.link && child.content.link.type === "Primary") || [];
  const secondaryLinks =
    footerData?.children?.filter((child) => child.content.link && child.content.link.type === "Secondary") || [];

  const logoUrl = getLogoUrl(footerData?.content?.logo?.logo);
  const logoAltText = footerData?.content?.logo?.logo?.altText || "Seddiqi Logo";

  const isKsa = language?.includes("-sa")

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column} style={{ gridArea: "logo" }}>
          <Link href={"/"}>
            <Image src={logoUrl} alt={logoAltText} width={195} height={36} className={styles.logo} />
          </Link>
          {!isKsa && <NewsletterSignup /> }
          <LanguageSelector />
        </div>
        <div className={styles.rightLinks}>
          <div className={styles.linkContainer}>
            <div className={styles.mainLinks}>
              {mainLinks.length > 0 && (
                <>
                  {[0, 4].map((offset) => (
                    <div key={offset} className={styles.column} style={{ gridArea: `links${offset / 4 + 1}` }}>
                      {renderLinks(mainLinks, offset, styles.mainLink)}
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className={styles.secondaryLinks}>
              {secondaryLinks.length > 0 && (
                <div className={`${styles.secondarySmallLinks} ${styles.column}`} style={{ gridArea: "links3" }}>
                  {renderLinks(secondaryLinks, 0, styles.secondMainLink)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />
      <div className={styles.footer_bottom}>
        <div className={styles.copy_right}>{footerData?.content?.copyright}</div>
        <div className={styles.social_icons}>
          {language?.includes("-sa") ? (
            <>
              <Link
                target="_blank"
                href={"https://www.instagram.com/seddiqi_ksa/"}
              >
                <FBIcon />
              </Link>
              <Link
                target="_blank"
                href={"https://www.facebook.com/profile.php?id=61571703210272"}
              >
                <InstaIcon />
              </Link>
              <Link target="_blank" href={"https://www.tiktok.com/@seddiqi_ksa?lang=en"}>
                <TiktokFooter />
              </Link>
            </>
          ) : (
            <>
              <Link target="_blank" href={"https://x.com/seddiqi_uae/"}>
                <TwitterIcon />
              </Link>
              <Link
                target="_blank"
                href={"https://www.facebook.com/ahmedseddiqiandsons"}
              >
                <InstaIcon />
              </Link>
              <Link
                target="_blank"
                href={"https://www.instagram.com/seddiqi_uae/"}
              >
                <FBIcon />
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
