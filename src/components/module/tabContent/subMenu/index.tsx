import NavigationLink from "@components/module/navigationLink";
import React, { useContext } from "react";
import styles from "./../tabContent.module.scss";
import { generateUniqueId } from "@utils/helpers/uniqueId";
import { HeaderContext } from "@contexts/headerContext";
import classNames from "classnames";

interface Props {
  links?: any;
  className?: string;
  isMobileChildAccordion?: boolean

}

const SubMenu = ({ links, className = "", isMobileChildAccordion }: Props) => {
  if (links?.length <= 0) {
    return null;
  }
  const { setMenuOpen } = useContext(HeaderContext);

  return (
    <div className={`${className} ${styles.subMenu}`}>
      {links?.map((item) => {
        if (!item?.content?.commonProps?.item_title) {
          return null;
        }
        return (
          <div key={generateUniqueId()} onClick={() => setMenuOpen(false)}>
            <NavigationLink
              className={classNames(styles.menuLink, isMobileChildAccordion && styles.childAccordionLink)}
              key={generateUniqueId()}
              title={item?.content?.commonProps?.item_title}
              arrow={item?.content?.commonProps?.isVisible}
              url={item?.content?.commonProps?.url}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SubMenu;
