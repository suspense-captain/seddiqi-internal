import React, { useEffect, useRef, useState } from "react";
import styles from "./pdpTabs.module.scss";
import { TechSpecsDummyData } from "./dummyData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getContentItemByKey, getContentItemById } from "@utils/cms/amplience";
import { capitalizeEachWord } from "@utils/helpers/capitalizeEachWord";


interface PdpTabsProps {
  productTechSpecs: any;
}

const PdpTabs: React.FC<any> = (props) => {
  const productCategory = props?.productTechSpecs?.category;
  const productTechSpecs = props?.productTechSpecs?.specsData;
  const nonTabProductTechSpecs = props?.productTechSpecs?.nonTabSpecsData[0];
  const amplienceData = props?.amplienceData;
  const tabsData = props?.productTechSpecs?.tabsData;
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isTechSpecsOpened, setIsTechSpecsOpened] = useState(false);
  const [isNonTabOpen, setIsNonTabOpen] = useState(true);
  const productBrand = props?.productResponse?.c_brandName;
  const isRolex = productBrand?.toLowerCase().includes("rolex");
  const dataDictionaryControl = props?.dataDictionary;

  // console.log("props: ", props);

  const shouldRenderTabs = Array.isArray(dataDictionaryControl) &&
  dataDictionaryControl.some((brandName) =>
    productBrand?.toLowerCase() === brandName?.toLowerCase()
  );

  const handleTabClick = (id: number) => {
    setActiveTab(id);
  };

  /**** The codes below this comment are for the Tech Specs Accordion ****/
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  const handleToggle = () => {
    //setIsOpen((prev) => !prev);
    //setIsTechSpecsOpened((prev) => !prev); // Toggle class-based behavior

    if(isTechSpecsOpened){
      setIsTechSpecsOpened(false);
      setIsNonTabOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1);
    }
    else{
      setIsOpen(true);
      setIsNonTabOpen(false);
      setTimeout(() => {
        setIsTechSpecsOpened(true);
      }, 800);
    }
    
  
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  
      setTimeout(() => {
        window.scrollBy(0, 0);
      }, 800);
    }
  };
  /**** End for Tech Specs Accordion codes ****/

  /**** The codes below this comment are for the Tech Specs List Accordion ****/
  const techSpecsData = TechSpecsDummyData.specsData;
  const [openItemIndex, setOpenItemIndex] = useState<number>(0); // Open the first item by default

  // Create a ref array dynamically based on the number of items
  const contentRefs = useRef<HTMLUListElement[]>([]);
  const [itemsListHeights, setItemsListHeights] = useState<number[]>(
    new Array(techSpecsData[0].specs.length).fill(0)
  );
  const [techSpecsContainerHeight, setTechSpecsContainerHeight] =
    useState<number>(0);

  // Function to toggle the accordion for a specific item
  const toggleAccordion = (index: number) => {
    setOpenItemIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Function to update content heights dynamically
  const updateHeights = () => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        const height = openItemIndex === index ? ref.scrollHeight : 0;
        ref.style.height = `${height}px`;
      }
    });

    if (isOpen) {
      setIsTechSpecsOpened(true);
    }
  };

  // Effect to handle changes in openItemIndex and resize events
  useEffect(() => {
    if (amplienceData != null || amplienceData != undefined) {
      // Update heights on openItemIndex change
      updateHeights();

      // Add resize event listener
      const handleResize = () => {
        setOpenItemIndex(null); // <- Close all spec items
        setIsOpen(false);
        setIsTechSpecsOpened(false);
        setIsNonTabOpen(true);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup event listener on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [openItemIndex]);
  /**** End for Tech Specs List Accordion codes ****/

  const isJewellery = productCategory?.toLowerCase().includes("jewel");
  const images = props.productResponse?.imageGroups[0]?.images

  return (
    <>
      {!shouldRenderTabs ? (
        <div className={`${styles.pdpNonTabContainer} ${!isJewellery ? styles.isWatches : ""}`}>
          <div
            className={`${styles.nonTabMainContainer} ${
              !isNonTabOpen ? styles.collapsed : ""
            }`}
          >
            <h2 className={styles.nonTabTitle}>Details & Specifications</h2>
          
            <div className={styles.specsContainer}>
              {nonTabProductTechSpecs.nonTabSpecs.map((specs, itemIndex) => {
                const validItems = specs.items.filter(
                  (item) => item.specsDescription && item.specsDescription != null
                );
          
                if (validItems.length === 0) return null;
          
                return (
                  <div key={itemIndex} className={styles.specs}>
                    {validItems.map((item, index) => (
                      <div
                        key={index}
                        className={`${styles.spec} ${
                          item.length >= 2 ? styles.hasMoreItems : ""
                        }`}
                      >
                        <h5>{item.specsTitle}</h5>
                        <p>{capitalizeEachWord(item.specsDescription)}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        
        {!isJewellery && 
        <div className={styles.techSpecsContent}>
            <div
              className={`${styles.techSpecsContainer} ${
                isTechSpecsOpened ? "techSpecsContainerClassOpened" : ""
              } techSpecsContainerClass`}
              style={{ height: isOpen ? `${contentHeight}px` : "0" }}
              ref={contentRef}
            >
              <h3 className={`${[styles.techSpecsMainTitle]}`}>
                {productTechSpecs[0].mainTitle}
              </h3>

              <ul className={styles.mainSpecsList}>
                {productTechSpecs[0].specs.map((spec, index) => (
                  <li key={spec.id} className={styles.spec}>
                    <h4
                      className={`${styles.specTitle} ${
                        openItemIndex === index ? styles.openedSpec : ""
                      }`}
                      onClick={() => toggleAccordion(index)}
                    >
                      {spec.specsTitle}
                    </h4>

                    <ul
                      className={styles.itemsList}
                      ref={(el) => (contentRefs.current[index] = el)}
                      style={{ height: `${itemsListHeights[index]}px` }}
                    >
                      {spec.items.map(
                        (item, itemIndex) =>
                          item.itemDescription &&
                          item.itemDescription != null && (
                            <li key={itemIndex} className={styles.item}>
                              <h5 className={styles.itemTitle}>
                                {item.itemTitle}
                              </h5>
                              <p className={styles.itemDescription}>
                              {capitalizeEachWord(item.itemDescription)}
                              </p>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`${styles.viewMoreDetails} ${
                isOpen ? styles.isOpened : ""
              } button plain dark_green`}
              onClick={handleToggle}
            >
              <span>{isOpen ? "View Less Details" : "View More Details"}</span>
            </button>
        </div>
        }
      </div>
      
      ) : (
        <div className={styles.pdpTabsContainer}>
          <div className={styles.tabsContainer}>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={16}
              breakpoints={{
                800: {
                  spaceBetween: 60,
                },
              }}
              className={styles.tabHeaders}
            >
              {tabsData.map((tab) => (
                <SwiperSlide key={tab.id} className={styles.tabSlide}>
                  <button
                    className={`${styles.tabButton} ${
                      activeTab === tab.id ? styles.active : ""
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {tab.tabTitle}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.tabContent}>
              <div className={styles.tabDataContent}>
                {tabsData.map((tab) => (
                  <div
                    key={tab.id}
                    className={`${styles.tabPane} ${
                      activeTab === tab.id ? styles.fadeIn : styles.fadeOut
                    }`}
                  >
                    <ul className={styles.specsContainer}>
                      {tab.specs.map(
                        (specs) =>
                          specs.description &&
                          specs.description != null && (
                            <li key={specs.title}>
                              <h5>{specs.title}</h5>
                              <p>{capitalizeEachWord(specs?.description)}</p>
                            </li>
                          )
                      )}
                    </ul>
                    {
                      <img
                        src={tab.productImageUrl || images && images.length > 0 && images[0]?.link}
                        className={styles.productImage}
                        alt=""
                      />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.techSpecsContent}>
            <div
              className={`${styles.techSpecsContainer} ${
                isTechSpecsOpened ? "techSpecsContainerClassOpened" : ""
              } techSpecsContainerClass`}
              style={{ height: isOpen ? `${contentHeight}px` : "0" }}
              ref={contentRef}
            >
              <h3 className={`${[styles.techSpecsMainTitle]}`}>
                {productTechSpecs[0].mainTitle}
              </h3>

              <ul className={styles.mainSpecsList}>
                {productTechSpecs[0].specs.map((spec, index) => (
                  <li key={spec.id} className={styles.spec}>
                    <h4
                      className={`${styles.specTitle} ${
                        openItemIndex === index ? styles.openedSpec : ""
                      }`}
                      onClick={() => toggleAccordion(index)}
                    >
                      {spec.specsTitle}
                    </h4>

                    <ul
                      className={styles.itemsList}
                      ref={(el) => (contentRefs.current[index] = el)}
                      style={{ height: `${itemsListHeights[index]}px` }}
                    >
                      {spec.items.map(
                        (item, itemIndex) =>
                          item.itemDescription &&
                          item.itemDescription != null && (
                            <li key={itemIndex} className={styles.item}>
                              <h5 className={styles.itemTitle}>
                                {item.itemTitle}
                              </h5>
                              <p className={styles.itemDescription}>
                              {capitalizeEachWord(item.itemDescription)}
                              </p>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`${styles.viewMoreDetails} ${
                isOpen ? styles.isOpened : ""
              } button plain dark_green`}
              onClick={handleToggle}
            >
              <span>{isOpen ? "View Less Details" : "View More Details"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PdpTabs;
