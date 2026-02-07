import { HeaderContext } from "@contexts/headerContext";
import { useContext } from "react";
import styles from "./navCardBlocks.module.scss";
import CardSection from "../cardSection";
import { ComponentMapping } from "@utils/cms/config";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import { headerTitleTranslations } from "@utils/data/english-arabic-static-data";
import { LanguageContext } from "@contexts/languageContext";

const NavCardBlocks = () => {
  const headerContext = useContext(HeaderContext);
  const { current, headerData } = headerContext;

  if (current === null || !headerData) {
    return null;
  }
  const { language } = useContext(LanguageContext);
  const contentBlock = headerData?.children[current]?.content?.contentBlock;
  if (!contentBlock) return null;
  return (
    <div className={styles.rightSideContainer}>
      {contentBlock.map((card, i) => {
        
        const CardComponent = ComponentMapping[card._meta.schema];
        const title = card._meta.schema.includes("story") ? headerTitleTranslations[language]?.story : card._meta.schema.includes("display") ? headerTitleTranslations[language]?.display : headerTitleTranslations[language]?.default;
        const cardStyle = card._meta.schema.includes("story") ? styles.storyCardContainer : styles.displayCards;

         return <CardSection
            key={generateUniqueId()}
            title={title}
            Component={CardComponent}
            cards={card._meta.schema.includes("article") ? card : Object.values(card)[1]}
            containerStyle={styles.column1}
            cardStyle={cardStyle}
            titleStyle={styles.displayCardsTitle}
          />

      })}
    </div>
  );
};

export default NavCardBlocks;
