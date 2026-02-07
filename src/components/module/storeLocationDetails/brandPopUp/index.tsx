import React, { useState, useEffect, Component, useContext } from "react";
import styles from "./brandPopUp.module.scss";
import Typography from "../../typography";
import RichText from "../../richText";
import SideDrawer from "../../sideDrawer";
import { Button } from "@components/module";
import { BrandPopUpProps } from "@utils/models/storeLocatorDetails";
import { findABoutiqueListingStaticData } from "@utils/data/english-arabic-static-data";
import { LanguageContext } from "@contexts/languageContext";
import classNames from "classnames";

const BrandPopUp: React.FC<BrandPopUpProps> = ({ brands, isOpen, onClose }) => {
  const { language } = useContext(LanguageContext);
  return (
    <div className={styles.storeDetailsWrapper}>
      <SideDrawer
        isOpen={isOpen}
        showFooter={false}
        showBackButton={true}
        onClose={onClose}
        onSubmit={null}
        onClearAll={null}
        position={"right"}
        className={""}
        button2Color={"black_dark"}
      >
        <div className={styles.brandListWrapper}>
          <Typography variant="h5" className={styles.title}>
           {findABoutiqueListingStaticData[language].availableBrands}
          </Typography>
          <div className={classNames(styles.brandsWrapper, styles.vline)}>
            {brands?.length > 0 &&
              brands.map((availableBrand, index) => {
                return (
                    <p key={index} className={styles.brandsName}>{availableBrand}</p>
                );
              })}
          </div>
        </div>
      </SideDrawer>
    </div>
  );
};

export default BrandPopUp;
