import SideDrawer from "@components/module/sideDrawer";
import Typography from "@components/module/typography";
import React, { useState } from "react";
import styles from "./productDescriptionFlyoutCard.module.scss";
import GenericAccordion from "@components/module/genericAccordion"; // Import GenericAccordion

const ProductDescriptionFlyoutCard = ({
  isDescriptionCardOpen,
  setDescriptionCardOpen,
  editorsView,
  product,
}) => {
  return (
    <SideDrawer
      isOpen={isDescriptionCardOpen}
      onClose={() => setDescriptionCardOpen(false)}
      showFooter={false}
      showBackButton={false}
      title={"Product Description"}
      position="right"
      button2Color={"black_dark"}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <Typography variant="p" className={styles.description}>
          {product?.longDescription}
        </Typography>
        <div className={styles.bar}>&nbsp;</div>

        {editorsView &&
        <GenericAccordion noPaddingClass={"noPadding"} buttonType={"arrow"}
          accordionItems={editorsView?.listItems?.map((item) => ({
            richText: item?.description,
          }))}
        />
        }
      </div>
    </SideDrawer>
  );
};

export default ProductDescriptionFlyoutCard;
