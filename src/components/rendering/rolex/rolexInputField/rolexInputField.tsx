import { useState, ChangeEvent } from "react";
import styles from "./rolexInputField.module.scss";

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
}

export default function RolexInputField({
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
}: InputFieldProps) {
  if (optionFull) {
    return (
      <div className={`${styles.selectGroupFull} ${styles.selectGroup}`}>
        {showLabel && (
          <label className={styles.dropdownLabel}>
            {label}
          </label>
        )}

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
      </div>
    );
  }

  return (
    <div>
      <div className={`${!options ? styles.inputGroup : styles.selectGroup}`}>
        {options ? (
          <>
            <label className={styles.dropdownLabel}>
              {label}
              {/* {required && "*"} */}
            </label>
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
            />
            <label>
              {label}
              {required && "*"}
            </label>
          </>
        )}
      </div>
      {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  );
}
