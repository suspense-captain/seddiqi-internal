import React from "react";
import styles from "./accountConfirmationBox.module.scss";
import { AccountIconBig } from "@assets/images/svg";
import Typography from "@components/module/typography";
import Button from "@components/module/button";
import { AccountConfirmationBoxProps } from "@utils/models";

const AccountConfirmationBox: React.FC<AccountConfirmationBoxProps> = ({
  title,
  subtitle1,
  subtitle2,
  showButton = true,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <AccountIconBig />
      </div>
      <Typography variant="h2" className={styles.title}>
        {title}
      </Typography>
      <div className={styles.subtitle}>
        {subtitle1 && <p className={styles.p}>{subtitle1}</p>}
        {subtitle2 && <p className={styles.p}>{subtitle2}</p>}
      </div>
      {/* {showButton && <div className={styles.btnContainer}>
        <Button
          clickHandler={() => console.log("")}
          className={styles.signInBtn}
          title="Sign In"
          isLink={false}
          type="transparant"
          color="metallic"
        />
      </div>} */}
    </div>
  );
};

export default AccountConfirmationBox;
