import React, { useState } from "react";
import styles from "./newsletter.module.scss";
import { Button, Typography } from "@components/module";

const Newsletter = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleToggle = () => {
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className={styles.newsletterContainer}>
      <div className={styles.leftSection}>
        <Typography align="left" variant="h2" className={styles.title}>
          Newsletter
        </Typography>

        <Typography align="left" variant="p" className={styles.subtitle}>
          Subscribe for to Get Free Cleaning & Polishing Servicing
        </Typography>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email*
            </label>
            <input type="email" id="email" className={styles.input} required />
          </div>

          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggle} ${
                isSubscribed ? styles.active : ""
              }`}
              onClick={handleToggle}
            >
              <div className={styles.toggleCircle}>
                <span className={styles.toggleIcon}>SS</span>
              </div>
            </div>
            <span className={styles.toggleLabel}>
              I would like to receive marketing information about AS&S products
              or services.
            </span>
          </div>
        </form>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.subscribeButton}>
          <Button
            clickHandler={() => console.log("")}
            className={styles.logoutButton}
            title="Subscribe"
            isLink={false}
            type="transparent"
            color="metallic"
          />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
