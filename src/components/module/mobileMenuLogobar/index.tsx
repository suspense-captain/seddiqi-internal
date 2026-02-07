import { useContext, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeaderContext } from "@contexts/headerContext";
import { HeaderFooter } from "@components/module";
import styles from "./mobileMenuLogobar.module.scss";
import { LanguageContext } from "@contexts/languageContext";
import { headerStaticData } from "@utils/data/english-arabic-static-data";
import LanguageSelector from "../languageSelector";

const MobileMenuLogobar = () => {
  const { headerData, menuOpen, setMenuOpen } = useContext(HeaderContext);
  const { language } = useContext(LanguageContext);
  const { leftLogo, bookingCTA } = headerData?.content;

  const PATEK_LOGO = "/images/patek-philippe-authorised-retailer.webp";
  const rolexContainerRef = useRef(null);

  useEffect(() => {
    if (rolexContainerRef.current) {
      rolexContainerRef.current.innerHTML = `<div id="rolex-retailer-clock">
        <div class="LinkEnabler" style="position:absolute; height:70px; width:150px; z-index:1;"></div>
        <iframe
          id="rolex_retailer"
          title="Rolex Official Retailer"
          src="https://static.rolex.com/retailers/clock/?colour=gold&amp;apiKey=fd5d8663fc8674a9ffab32649c3e39bf&amp;lang=en"
          style="width:150px;height:70px;border:0;margin:0;padding:0;overflow:hidden;z-index:0;position:relative;"
          scrolling="NO"
          frameborder="NO">
        </iframe>
      </div>`;
    }
  }, [menuOpen]);

  const isKsa = language?.includes("-SA")

  return (
    <div style={{marginTop: isKsa && "0"}} className={styles.bottom}>
      <div className={styles.recommendContainer}>
        {!isKsa && (
          <div className={styles.recommendText}>
            {headerStaticData[language]?.recommendedForYouLabel}
          </div>
        )}
        <div className={styles.logos}>
          {menuOpen && (
            <>
              {headerData?.content?.rolexLogo && (
                <Link
                  onClick={() => setMenuOpen(false)}
                  href={headerData?.content?.rolexLogo}
                >
                  <div
                    ref={rolexContainerRef}
                    className={styles.rolexScriptContainer}
                  ></div>
                </Link>
              )}

              {headerData?.content?.patekLogo && (
                <Link
                  onClick={() => setMenuOpen(false)}
                  href={headerData?.content?.patekLogo}
                >
                  <Image
                    src={PATEK_LOGO}
                    width={114}
                    height={67}
                    alt={leftLogo?.image?.altText || "Patek Philippe"}
                    className={styles.image}
                  />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      <LanguageSelector />
      
      <HeaderFooter className={styles.headerFooter} />
    </div>
  );
};

export default MobileMenuLogobar;
