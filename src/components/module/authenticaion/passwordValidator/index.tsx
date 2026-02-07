import React from 'react';
import { GreenTick } from "@assets/images/svg";
import styles from "./passwordValidator.module.scss";

interface PasswordValidatorProps {
  password: string;
  validations: {
    length: boolean;
    uppercase: boolean;
    number: boolean;
    specialChar: boolean;
  };
}

const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password, validations }) => {
  return (
    <div className={styles.passwordCriteria}>
      {validations.length && (
        <div className={validations.length ? styles.valid : styles.invalid}>
          <GreenTick /> <span>At least 8 characters</span>
        </div>
      )}
      {validations.uppercase && (
        <div className={validations.uppercase ? styles.valid : styles.invalid}>
          <GreenTick /> Contain 1 uppercase letter
        </div>
      )}
      {validations.number && (
        <div className={validations.number ? styles.valid : styles.invalid}>
          <GreenTick /> Contain 1 number
        </div>
      )}
      {validations.specialChar && (
        <div className={validations.specialChar ? styles.valid : styles.invalid}>
          <GreenTick /> At least 1 special character (!@#$%^&*)
        </div>
      )}
    </div>
  );
};

export default PasswordValidator;
