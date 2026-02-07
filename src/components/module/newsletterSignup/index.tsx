import React, { useContext, useState } from "react";
import styles from "./newsletterSignup.module.scss";
import Typography from "../typography";
import Loader from "../loader";
import { subscribedToNewsletter } from "@utils/sfcc-connector/dataService";
import { LanguageContext } from "@contexts/languageContext";
import { newsletterSignup } from "@utils/data/english-arabic-static-data";



const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { language } = useContext(LanguageContext); 

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      setStatusMessage(newsletterSignup[language]?.invalidEmailMessage);
      setIsError(true);
      return;
    }

    if (!isChecked) {
      setStatusMessage(newsletterSignup[language]?.agreeToPrivacyPolicyMessage);
      setIsError(true);
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        email,
        isSubscribed,
      };

      const response = await subscribedToNewsletter({
        userData: formData,
        method: "POST",
        locale: language
      });

      if (!response?.isError && response?.status === 200) {
        setStatusMessage(newsletterSignup[language]?.successMessage);
        setIsError(false);
      } else if (!response?.isError && response?.status === 400) {
        setStatusMessage(newsletterSignup[language]?.alreadySubscribedMessage);
        setIsError(true);
      } else {
        setStatusMessage(newsletterSignup[language]?.errorMessage);
        setIsError(true);
      }
    } catch (error) {
      console.error("error----", error);
      setStatusMessage(newsletterSignup[language]?.errorOccurredMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.newsletter}>
      {isLoading ? <Loader /> : null}
      <Typography variant="h6" className={styles.newsletterTitle}>
        {newsletterSignup[language]?.title}
      </Typography>
      <div className={styles.newsletterContent}>
        <div className={styles.newsletterInputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletterSignup[language]?.emailPlaceholder}
            className={`${styles.newsletterInput} ${styles.languageDropdown}`}
          />
          <button className={styles.newsletterButton} onClick={handleSubscribe} disabled={isLoading}>
            {newsletterSignup[language]?.subscribeButton}
          </button>
        </div>
        <div className={styles.newsletterCheckboxContainer}>
          <input
            type="checkbox"
            id="privacyPolicy"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="privacyPolicy">
            {newsletterSignup[language]?.privacyPolicyLabel}
          </label>
        </div>
        {statusMessage && (
          <p className={`${styles.statusMessage} ${isError ? styles.error : styles.success}`}>
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
