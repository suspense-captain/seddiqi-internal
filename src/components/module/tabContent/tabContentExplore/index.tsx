import React, { useContext, useState } from "react";
import styles from "./../tabContent.module.scss";
import { HeaderContext } from "@contexts/headerContext";
import StoryCard from "@components/module/cards/storyCard";
import DisplayCard from "@components/module/cards/displayCard";
import ArticleCard from "@components/module/cards/articleCard";
import MobileMenuLogobar from "@components/module/mobileMenuLogobar";
import SubMenu from "@components/module/tabContent/subMenu";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import { ComponentMapping } from "@utils/cms/config";
import CardSection from "@components/module/cardSection";
import Accordion from "@components/module/accordion";
import { LanguageContext } from "@contexts/languageContext";
import { headerTitleTranslations } from "@utils/data/english-arabic-static-data";

const TabContentExplore = () => {
  const { headerData } = useContext(HeaderContext);

  let explore = headerData?.children
    .filter((item) => item?.content?.type !== "Products")
    .map((item) => {
      if (Array.isArray(item?.children)) {
        return item?.children?.flat();
      } else {
        return item;
      }
    })
    .flat();
  
  if (!explore) return null;

  const contentBlock = explore?.content?.contentBlock;

  const [childSubMenu, setChildSubMenu] = useState("");

  const GetSubMenu = () => {
    const subMenuLinks = explore;

    return subMenuLinks && subMenuLinks.length > 0 ? (
      <div key={generateUniqueId()} className={styles.mobileMenuLinks}>
        {subMenuLinks.map((links, index) => {
          const title = links?.content?.commonProps?.item_title;
          return (
            <Accordion
              type={"header"}
              showArrow={links?.children.length > 0}
              subMenu={childSubMenu}
              setSubMenu={setChildSubMenu}
              item={{
                ...links,
                id: links?.content?._meta.deliveryId,
                title: title,
                url: links?.content?.commonProps?.url,
                isNewTab: false,
                index: index,
              }}
              key={index}
              isCollapse
            >
              <SubMenu
                links={links?.children}
                isMobileChildAccordion
                className={styles.exploreSubMenuMobile}
              />
            </Accordion>
          );
        })}
      </div>
    ) : null;
  };

  const { language } = useContext(LanguageContext);
  const isKsa = language?.includes("-sa")

  return (
    <div className={styles.tabContent}>
      <div className={styles.mobileMenuLinks}>
        <div className={styles.mobileMenuNavigationContainer}>
          <div
            className={`${styles.customContainer} ${styles.subMenuContainer}`}
          >
            <GetSubMenu />

            {!isKsa && (
              <div className={`${styles.padZero} ${styles.subMenu}`}>
                {contentBlock &&
                  contentBlock.map((card, i) => {
                    const CardComponent = ComponentMapping[card._meta.schema];
                    const title = card._meta.schema.includes("story")
                      ? headerTitleTranslations[language].story
                      : card._meta.schema.includes("display")
                      ? headerTitleTranslations[language]?.display
                      : headerTitleTranslations[language]?.default;

                    return (
                      <CardSection
                        title={title}
                        Component={CardComponent}
                        cards={
                          card._meta.schema.includes("article")
                            ? card
                            : Object.values(card)[1]
                        }
                        containerStyle={styles.column1}
                        cardStyle={styles.cardStyle}
                        titleStyle={styles.displayCardsTitle}
                        key={generateUniqueId()}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileMenuLogobar />
    </div>
  );
};

export default TabContentExplore;
