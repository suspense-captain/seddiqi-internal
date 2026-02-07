import React from "react";
import styles from "./sizeGuide.module.scss";
import Typography from "../typography";
import SideDrawer from "../sideDrawer";
import { SizeGuideProps } from "@utils/models/sizeGuide";

const SizeGuide: React.FC<SizeGuideProps> = ({
  primaryTitle,
  primaryDescription,
  secondaryTitle,
  secondaryDescription,
  items,
  isOpen,
  onClose,
}) => {
  return (
    <SideDrawer
      isOpen={isOpen}
      showFooter={false}
      onSubmit={null}
      onClearAll={null}
      showBackButton={true}
      onClose={onClose}
      position={"right"}
      className={""}
      button2Color={"black_dark"}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <Typography variant="h4" className={styles.title}>
            {primaryTitle}
          </Typography>
          <Typography variant="p" className={styles.description}>
            {primaryDescription}
          </Typography>
        </div>

        <div className={styles.tableWrapper}>
          <Typography variant="h5" className={styles.sizeGuidetableTitle}>
            {secondaryTitle}
          </Typography>
          <Typography variant="p" className={styles.sizeGuidetableDesc}>
            {secondaryDescription}
          </Typography>
        </div>

        <table className={styles.tableContent}>
          <thead>
            <tr>
              <th>{items[0]?.label}</th>
              <th>{items[1]?.label}</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 &&
            items[0].listItems.length > 0 &&
            items[1]?.listItems.length > 0 ? (
              items[0].listItems.map((_, index) => (
                <tr key={index}>
                  <td>{items[0].listItems[index]}</td>{" "}
                  <td>{items[1].listItems[index]}</td>{" "}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No size information available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SideDrawer>
  );
};

export default SizeGuide;
