import React, { useContext, useState } from "react";
import styles from "./../tabContent.module.scss";
import { HeaderContext } from "@contexts/headerContext";
import DisplayCard from "@components/module/cards/displayCard";
import MobileMenuLogobar from "@components/module/mobileMenuLogobar";
import Accordion from "@components/module/accordion";
import SubMenu from "@components/module/tabContent/subMenu";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import CardSection from "@components/module/cardSection";
import { ComponentMapping } from "@utils/cms/config";
import { LanguageContext } from "@contexts/languageContext";
import { headerTitleTranslations } from "@utils/data/english-arabic-static-data";

const TabContentProducts = () => {
  const { headerData } = useContext(HeaderContext);
  const { language } = useContext(LanguageContext);

  // Manage subMenu state at the top level
  const [subMenu, setSubMenu] = useState("");
  // We also need state for each child accordion, keyed by product index:
  const [childSubMenus, setChildSubMenus] = useState<Record<number, string>>({});

  if (!headerData) return null;

  const products = headerData.children.filter(
    (item) => item?.content?.type !== "Explore"
  );

  if (!products || products.length === 0) return null;

  const isDropdown = (ind: number) => products[ind].children.length > 0;

  // Handler to update child submenu state per product index
  const setChildSubMenuForIndex = (index: number, value: string) => {
    setChildSubMenus((prev) => ({ ...prev, [index]: value }));
  };

  const renderAccordionContent = (ind: number) => {
    const subMenuLinks = products[ind].children || [];
    const contentBlock = products[ind]?.content?.contentBlock;
  
    if (!subMenuLinks.length && !contentBlock) return null;
  
    return (
      <div key={`accordion-content-${ind}`}>
        {subMenuLinks.length > 0 && subMenuLinks.map((links, index) => {
          const title = links?.content?.commonProps?.item_title || "";
  
          return (
            <Accordion
              type={"header"}
              showArrow={links?.children.length > 0}
              subMenu={childSubMenus[ind] ?? ""}
              setSubMenu={(val) => setChildSubMenuForIndex(ind, val)}
              item={{
                ...links,
                id: links?.content?._meta.deliveryId,
                title: title,
                url: links?.content?.commonProps?.url,
                isNewTab: false,
                index: index,
              }}
              key={links?.content?._meta.deliveryId || index}
              isCollapse
              isChildAccordion
            >
              <SubMenu links={links?.children} isMobileChildAccordion />
            </Accordion>
          );
        })}
  
        {contentBlock &&
          contentBlock.map((card, i) => {
            const CardComponent = ComponentMapping[card._meta.schema];
            const title = card._meta.schema.includes("story")
              ? headerTitleTranslations[language]?.story
              : card._meta.schema.includes("display")
              ? headerTitleTranslations[language]?.display
              : headerTitleTranslations[language]?.default;
  
            return (
              <CardSection
                title={title}
                Component={CardComponent}
                cards={card._meta.schema.includes("article") ? card : Object.values(card)[1]}
                containerStyle={styles.column1}
                cardStyle={styles.subMenu}
                titleStyle={styles.displayCardsTitle}
                key={generateUniqueId()}
              />
            );
          })}
      </div>
    );
  };
  

  return (
    <div className={styles.tabContent}>
      <div className={styles.mobileMenuLinks}>
        {products.map((item, ind) => (
          <div key={item?.content?._meta.deliveryId || ind} className={styles.mobileMenuNavigationContainer}>
            <Accordion
              type={"header"}
              showArrow={isDropdown(ind)}
              subMenu={subMenu}
              setSubMenu={setSubMenu}
              item={{
                ...item,
                id: item?.content?._meta.deliveryId,
                title: item?.content?.commonProps?.item_title,
                url: item?.content?.commonProps?.url,
                isNewTab: item?.content?.commonProps?.isNewTab,
                index: ind,
              }}
              isCollapse
            >
              {isDropdown(ind) && renderAccordionContent(ind)}
            </Accordion>
          </div>
        ))}
      </div>
      <MobileMenuLogobar />
    </div>
  );
};

export default TabContentProducts;