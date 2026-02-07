import { useState, ChangeEvent } from "react";
import styles from "./inputField.module.scss";
import { ArrowDown } from "@assets/images/svg";

interface InputFieldProps {
  name?: string;
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errorMessage?: string;
  required?: boolean;
  optionFull?: boolean;
  showLabel?: boolean;
  options?: string[];
  maxLength?: number
}

export default function InputField({
  name,
  label,
  type,
  value,
  onChange,
  errorMessage,
  required = false,
  options,
  optionFull = false,
  showLabel = false,
  maxLength
}: InputFieldProps) {
  if (optionFull) {
    return (
      <div className={`${styles.selectGroupFull} ${styles.selectGroup}`}>
        {showLabel && <label className={styles.dropdownLabel}>{label}</label>}

        <div className={styles.selectWrapper}>
          <select
            value={value || options?.[0]}
            name={name}
            onChange={onChange}
            className={errorMessage ? styles.inputError : ""}
            required={required}
          >
            <option value="" disabled hidden>
              {required ? `${label} *` : label}
            </option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ArrowDown className={styles.customArrow} />
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className={`${!options ? styles.inputGroup : styles.selectGroup}`}>
        {options ? (
          <>
            <label className={styles.dropdownLabel}>{label}</label>
            <div className={styles.selectWrapper}>
              <select
                value={value || options[0]}
                name={name}
                onChange={onChange}
                className={errorMessage ? styles.inputError : ""}
                required={required}
              >
                <option value="" disabled hidden>
                  {required ? `${label} *` : label}
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ArrowDown className={styles.customArrow} />
            </div>
          </>
        ) : (
          <>
            <input
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              className={errorMessage ? styles.inputError : ""}
              placeholder=" "
              required={required}
              {...(maxLength ? { maxLength } : {})}
            />
            <label>
              {label}
              {required && "*"}
            </label>
          </>
        )}
      </div>
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
}
