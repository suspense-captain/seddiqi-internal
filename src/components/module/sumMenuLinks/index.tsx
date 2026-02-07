import { HeaderContext } from "@contexts/headerContext";
import { useContext } from "react";
import styles from "./subMenuLinks.module.scss";
import NavigationLink from "../navigationLink";
import { generateUniqueId } from "@utils/helpers/uniqueId";

const SubMenuLinks = () => {
  const headerContext = useContext(HeaderContext);
  const { current, headerData, updateCurrent } = headerContext;
  const currentHeaderData = headerData?.children[current]?.children;

  if (current === null || !currentHeaderData) {
    return null;
  }

  const renderLinks = (links) => {
    return links?.map(({ content }) => {
      const { item_title, isVisible } = content?.commonProps || {};
      if (!item_title) {
        return null;
      }
      return (
        <div onClick={() => updateCurrent(null)} key={generateUniqueId()}>
          <NavigationLink
            className={styles.menuLink}
            key={generateUniqueId()}
            title={`${item_title}`}
            arrow={isVisible}
            url={content?.commonProps?.url ? content?.commonProps?.url : "/"}
            isNewTab={content?.commonProps?.isNewTab}
          />
        </div>
      );
    });
  };

  const columnOne = currentHeaderData[0]?.content?.commonProps?.item_title;
  const columnTwo = currentHeaderData[1]?.content?.commonProps?.item_title;

  return (
    <div className={styles.menuLeft}>
      {currentHeaderData?.map((item) => {
        return (
          <div className={styles.columnCategories} key={generateUniqueId()}>
            <div className={styles.label}>{item?.content?.commonProps?.item_title}</div>
            {renderLinks(item?.children)}
          </div>
        );
      })}
    </div>
  );
};

export default SubMenuLinks;
