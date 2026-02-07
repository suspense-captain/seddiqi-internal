import SideDrawer from "@components/module/sideDrawer";
import React, { useState } from "react";
import styles from "./productShippingDetailsFlyoutCard.module.scss";
import { MailIcon, PhoneIcon, WhatsappIcon } from "@assets/images/svg";

const ProductShippingDetailsFlyoutCard = ({ isShippingCardOpen, setShippingCardOpen, shippingDetails}) => {
  return (
    <SideDrawer
      isOpen={isShippingCardOpen}
      onClose={() => setShippingCardOpen(false)}
      showFooter={false}
      showBackButton={false}
      title={shippingDetails?.primaryTitle}
      position="right"
      button2Color={"black_dark"}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <ul className={styles.accordianDesc}>
          {shippingDetails?.primaryDescription?.map((item) => {
            return (
              <li className={styles.descItem}>
                <span className={styles.bullet}>&nbsp;</span>
                <span>{item}</span>
              </li>
            );
          })}
        </ul>

        <div className={styles.title}>{shippingDetails?.secondaryTitle}</div>
        <div className={styles.desc}>{shippingDetails?.secondaryDescription}</div>
        <div className={styles.icons}>
          <a href="mailto:info@seddiqi.com" style={{ textDecoration: "none" }}>
            <MailIcon />
          </a>

          <a href="tel:+97145119999" style={{ textDecoration: "none" }}>
            <PhoneIcon />
          </a>
          {/* <a href="tel:+1234567890" style={{ textDecoration: "none" }}>
            <WhatsappIcon strokeColor={"black"} />
          </a> */}
        </div>
      </div>
    </SideDrawer>
  );
};

export default ProductShippingDetailsFlyoutCard;
