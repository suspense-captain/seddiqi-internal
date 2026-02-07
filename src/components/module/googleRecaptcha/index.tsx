import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./googleRecaptcha.module.scss";

interface GoogleRecaptchaPropType {
  onChange: ((token: string | null) => void) | undefined;
  error?: string;
  onErrored?: (() => void) | undefined;
  setCaptchaRef?:any;
}

const NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: string = process.env
  .NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY as string;

const GoogleRecaptcha = ({
  onChange,
  error,
  onErrored,
  setCaptchaRef
}: GoogleRecaptchaPropType) => {
  return (
    <div className={styles.recaptchaContainer}>
      <div className={styles.recaptcha}>
        <ReCAPTCHA
          sitekey={NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
          onChange={onChange}
          onErrored={onErrored}
          ref={(ref) => setCaptchaRef(ref)}
        />
        {error ? <span className={styles.recaptchaError}>{error}</span> : null}
      </div>
    </div>
  );
};

export default GoogleRecaptcha;



