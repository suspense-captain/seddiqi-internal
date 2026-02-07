import SideDrawer from "@components/module/sideDrawer";
import Typography from "@components/module/typography";
import React, { useState } from "react";
import styles from "./productCareAndWarrantyFlyoutCard.module.scss";
import Button from "@components/module/button";
import GenericAccordion from "@components/module/genericAccordion"; // Import GenericAccordion

const ProductCareAndWarrantyFlyoutCard = ({
  isCareAndWarrantyCardOpen,
  setCareAndWarrantyCardOpen,
  warrantyAndCare,
}) => {
  const [subMenu, setSubMenu] = useState(false);

  if (!warrantyAndCare) {
    return null;
  }

  return (
    <SideDrawer
      isOpen={isCareAndWarrantyCardOpen}
      onClose={() => {
        setCareAndWarrantyCardOpen(false);
      }}
      showFooter={false}
      showBackButton={false}
      title={warrantyAndCare?.primaryTitle}
      position="right"
      button2Color={"black_dark"}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <GenericAccordion noPaddingClass={"noPadding"} buttonType={"arrow"}
          accordionItems={warrantyAndCare?.listItems?.map((item, index) => ({
            mainTitle: item?.title,
            richText: item?.description,
          }))}
        />

        <div className={styles.btns}>
          {warrantyAndCare?.servicesCta && warrantyAndCare?.servicesCta?.label && (
            <Button
              isLink={true}
              link={warrantyAndCare?.servicesCta?.url}
              className={styles.serviceBtn}
              title={warrantyAndCare?.servicesCta?.label}
              color={warrantyAndCare?.servicesCta?.color}
              type={warrantyAndCare?.servicesCta?.type}
              new_tab={warrantyAndCare?.servicesCta?.isNewTab}
            />
          )}

          {warrantyAndCare?.downloadCta && (
            <Button
              isLink={true}
              link={warrantyAndCare?.downloadCta?.url}
              className={styles.serviceBtn}
              title={warrantyAndCare?.downloadCta?.label}
              color={warrantyAndCare?.downloadCta?.color}
              type={warrantyAndCare?.downloadCta?.type}
              new_tab={warrantyAndCare?.downloadCta?.isNewTab}
            />
          )}
        </div>
      </div>
    </SideDrawer>
  );
};

export default ProductCareAndWarrantyFlyoutCard;
