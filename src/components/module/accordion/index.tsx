import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./accordion.module.scss";
import NavigationLink from "../navigationLink";
import { ArrowDown } from "@assets/images/svg";
import { AccordionProps } from "@utils/models";
import { HeaderContext } from "@contexts/headerContext";
import classNames from "classnames";
import { useDeviceWidth } from "@utils/useCustomHooks";

const Accordion: React.FC<AccordionProps> = ({
  item,
  children,
  setSubMenu,
  subMenu,
  showArrow = false,
  isOpen = false,
  url,
  isCollapse = false,
  isChildAccordion,
  type
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapse);
  const [height, setHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { headerRef, setMenuOpen } = useContext(HeaderContext);
  const isDesktop = useDeviceWidth();
 
  const handleClick = (key, isNavClick: boolean) => {
    setSubMenu(subMenu === key ? "" : key);
    setIsCollapsed(prev => (prev === key ? false : true));

    const section = document.getElementById("mobile-header");
    
    const isMobileHeaderAccordionChecker =
    !isDesktop[0] &&
    section &&
    parentRef &&
    parentRef.current &&
    !isChildAccordion;
    
    if(type === "header") {
      headerRef?.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scrolls only on the parent position
      if (isMobileHeaderAccordionChecker) {
        const parentRefTopValue =
          parentRef.current.getBoundingClientRect().top ?? 0;
  
        setTimeout(() => {
          if (isNavClick) {
            setMenuOpen(false);
            section.scrollTo({
              top: 0,
            });
          } else {
            section.scrollTo({
              top: parentRefTopValue - 5,
              behavior: "smooth",
            });
          }
        }, 400); // Delay to match the smooth scroll duration
      }
    }

  };

  useLayoutEffect(() => {
    typeof window !== "undefined" && contentRef.current
      ? setHeight(contentRef.current.clientHeight + 5)
      : setHeight(0);
  }, [contentRef.current, window, subMenu, parentRef]);

  useEffect(() => {
    if (isOpen) {
      handleClick(item.index, false);
    }
  }, [isOpen, item]);


  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children, subMenu, isCollapsed]);

  
  return (
    <div
      className={classNames(
        styles.accordion,
        isChildAccordion && styles.accordionChild
      )}
      key={item.index}
    >
      <div
        className={classNames(
          styles.accordionLink,
          isChildAccordion && styles.accordionLinkChild
        )}
        onClick={() => {
          handleClick(item.index, false);
        }}
        aria-expanded={subMenu === item.index && isCollapsed}
        id={`section-${item.id}`}
        ref={parentRef}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (item?.url) {
              setMenuOpen(false);
              handleClick(item.index, true);
            }
          }}
          className={classNames(
            styles.headerLink,
            isChildAccordion && styles.headerLinkChild
          )}
        >
          <NavigationLink
            url={isChildAccordion ? null : item?.url}
            isNewTab={item?.isNewTab}
            hover={false}
            title={item?.title}
          />
        </span>

        {showArrow && (
          <div>
            <ArrowDown
              className={
                subMenu === item.index && isCollapsed && styles.activeArrow
              }
            />
          </div>
        )}
      </div>
      <div
        className={classNames(
          styles[
            subMenu === item.index && isCollapsed
              ? "contentShow"
              : "contentParent"
          ],
          isChildAccordion &&
            subMenu === item.index &&
            isCollapsed &&
            styles.containerChild
        )}
        style={{ height: subMenu === item.index && isCollapsed ? height : 0 }}
        key={item.index}
      >
        <div
          ref={contentRef}
          className={styles.accordionContainer}
          key={item.index}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
