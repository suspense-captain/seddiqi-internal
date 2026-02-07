import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import styles from "./register.module.scss";
import Button from "@components/module/button";
import SlidingRadioSwitch from "@components/module/slidingRadioSwitch";
import { GreenTick } from "@assets/images/svg";
import InputField from "@components/module/inputField";
import Typography from "@components/module/typography";
import {
  passwordCriteria,
  validateConfirmEmail,
  validateConfirmPassword,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  validatePhone,
  validateTitle,
} from "@utils/helpers/validations";
import { SignUpFormErrors } from "@utils/models";
import { getCustomer, logoutCustomer, registerCustomer } from "@utils/sfcc-connector/dataService";
import AccountConfirmationBox from "../accountConfirmationBox";
import { useRouter } from "next/router";
import PasswordValidator from "../passwordValidator";
import { countryCodes } from "@utils/data/countryCodes";
import { signIn, signOut, useSession } from "next-auth/react";
import Loader from "@components/module/loader";
import logger from "@utils/logger";

const Register = ({ gridColumn = "1fr 1fr", hideTabbedNavigation }) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("Mr");
  const [phoneCode, setPhoneCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        break;
      case "confirmEmail":
        setConfirmEmail(value);
        setErrors((prev) => ({
          ...prev,
          confirmEmail: validateConfirmEmail(email, value),
        }));
        break;
      case "password":
        setPassword(value);
        setPasswordValidations({
          length: passwordCriteria.length(value),
          uppercase: passwordCriteria.uppercase(value),
          number: passwordCriteria.number(value),
          specialChar: passwordCriteria.specialChar(value),
        });
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(password, value),
        }));
        break;
      case "firstName":
        if (/\d/.test(value)) {
          setErrors((prev) => ({ ...prev, firstName: "First Name should not contain numbers." }));
        } else {
          setFirstName(value);
          setErrors((prev) => ({ ...prev, firstName: validateFirstName(value) }));
        }
        break;
      case "lastName":
        if (/\d/.test(value)) {
          setErrors((prev) => ({ ...prev, lastName: "Last Name should not contain numbers." }));
        } else {
          setLastName(value);
          setErrors((prev) => ({ ...prev, lastName: validateLastName(value) }));
        }
        break;
      case "phone":
        if (/^\d*$/.test(value) && value.length <= 10) {
          setPhone(value);
          setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
        }
        break;
      case "title":
        setTitle(value);
        setErrors((prev) => ({ ...prev, title: validateTitle(value) }));
        break;
      default:
        break;
    }
  };

  const validateForm = (): boolean => {
    setErrors({
      email: validateEmail(email),
      confirmEmail: validateConfirmEmail(email, confirmEmail),
      password: validatePassword(password),
      // confirmPassword: validateConfirmPassword(password, confirmPassword),
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      phone: validatePhone(phone),
      title: validateTitle(title),
    });

    return !Object.values(errors).some((error) => error !== "");
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    e.preventDefault();

    if (validateForm()) {
      const userData = {
        email,
        password,
        fname: firstName,
        lname: lastName,
        phone: `${phoneCode} ${phone}`,
        salutation: title,
        privacyPolicy: agreedToTerms,
        marketingCommunication: marketingOptIn,
      };

      try {
        const salesforceResponse = await registerCustomer({
          userData: JSON.stringify(userData),
          method: "POST",
        });

        if (salesforceResponse.isError) {
          setErrors((prev) => ({
            ...prev,
            email: salesforceResponse.response?.detail,
          }));
        } else {
          const response = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
            registrationPayload: JSON.stringify(salesforceResponse.response.response),
          });
          
          if (response.ok) {
            setIsRegistered(true);
            hideTabbedNavigation(true);
            setTimeout(() => {
              const redirect = router.pathname === "/book-an-appointment" ? "/book-an-appointment" : "/account";
              router.push(redirect);
            }, 3000);
          }
        }
      } catch (error) {
        logger.error(error?.message || "An error occurred during registration.");
      }
    }

    setIsLoading(false);
  };

  const containerStyles: React.CSSProperties = {
    gridTemplateColumns: gridColumn,
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loader /> : null}
      {
        isRegistered ? 
        <AccountConfirmationBox
          title="Your account has been Created"
          subtitle1="Your account has been Created. "
          subtitle2="Please sign in to access your account!"
          showButton={true}
        /> :
        <form className={styles.signin} onSubmit={handleRegisterSubmit}>
          <div className={styles.formGroup}>
            <div className={`${styles.doubleForm} ${gridColumn === "1fr" ? styles.fullWidth : ""}`}>
              {/* Title and First Name */}
              <div className={`${gridColumn === "1fr"} ${styles.optionSelector}`}>
                {gridColumn === "1fr" ? (
                  <InputField
                    name="title"
                    label="Title"
                    value={title}
                    onChange={handleInputChange}
                    options={["Mr", "Mrs", "Ms"]}
                    errorMessage={errors.title}
                    required
                    showLabel
                  />
                ) : (
                  <InputField
                    name="title"
                    label="Title"
                    value={title}
                    onChange={handleInputChange}
                    options={["Mr", "Mrs", "Ms"]}
                    errorMessage={errors.title}
                    required
                    showLabel
                  />
                )}

                <InputField
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleInputChange}
                  label="First Name"
                  errorMessage={errors.firstName}
                  required
                  showLabel
                  
                />
              </div>
              {/* Last Name */}
              <InputField
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleInputChange}
                label="Last Name"
                errorMessage={errors.lastName}
                required
                showLabel
              />
            </div>

            <div className={`${styles.doubleForm} ${gridColumn === "1fr" ? styles.fullWidth : ""}`}>
              {/* Email */}
              <InputField
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                label="Email"
                errorMessage={errors.email}
                required
                showLabel
              />
              {/* Confirm Email */}
              <InputField
                type="email"
                name="confirmEmail"
                value={confirmEmail}
                onChange={handleInputChange}
                label="Repeat Email"
                errorMessage={errors.confirmEmail}
                required
                showLabel
              />
            </div>

            <div className={`${styles.doubleForm} ${gridColumn === "1fr" ? styles.fullWidth : ""}`}>
              {/* Password Field */}
              <div>
                <InputField
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  label="Password"
                  errorMessage={errors.password}
                  required
                  showLabel
                />
                <PasswordValidator password={password} validations={passwordValidations} />
                {/* Password Validation Indicators */}
                {/* <div style={containerStyles} className={`${styles.passwordCriteria}`}>
                  {passwordValidations?.length && (
                    <div className={passwordValidations?.length ? styles.valid : styles.invalid}>
                      <GreenTick /> <span>At least 8 characters</span>
                    </div>
                  )}
                  {passwordValidations?.uppercase && (
                    <div className={passwordValidations?.uppercase ? styles.valid : styles.invalid}>
                      <GreenTick /> Contain 1 uppercase letter
                    </div>
                  )}
                  {passwordValidations?.number && (
                    <div className={passwordValidations?.number ? styles.valid : styles.invalid}>
                      <GreenTick /> Contain 1 number
                    </div>
                  )}
                  {passwordValidations?.specialChar && (
                    <div className={passwordValidations?.specialChar ? styles.valid : styles.invalid}>
                      <GreenTick /> At least 1 special character (!@#$%^&*)
                    </div>
                  )}
                </div> */}
              </div>

              {/* Confirm Password */}
              {/* <InputField
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                label="Confirm Password"
                errorMessage={errors.confirmPassword}
                required
                showLabel
              /> */}

              {/* Phone Number */}
              <div>
                <div className={styles.formGroupPhone}>
                  <InputField
                    name="phone code"
                    label=""
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    options={countryCodes}
                    required
                    showLabel
                  />
                  <InputField
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={handleInputChange}
                    label="Phone Number"
                    errorMessage={errors.phone}
                    required
                    showLabel
                  />
                </div>
                {!errors.phone && (
                  <Typography
                    align="left"
                    variant="p"
                    className={styles.helperText}
                  >
                    Enter phone number without the area code
                  </Typography>
                )}
              </div>
            </div>

            <div className={`${styles.doubleForm} ${gridColumn === "1fr" ? styles.fullWidth : ""}`}>
              <div className={`${gridColumn === "1fr" && styles.slidingSwitchReverse} ${styles.slidingSwitch}`}>
                <SlidingRadioSwitch
                  toggleLabel={""}
                  onToggle={(value) => setAgreedToTerms(!value)}
                  value={true}
                  noToggle={true}
                />
                <p className={styles.switchLabel}>
                  I agree to Ahmed Seddiqi & Sons Terms & Conditions and Privacy Policy.
                </p>
              </div>
              <div className={`${gridColumn === "1fr" && styles.slidingSwitchReverse} ${styles.slidingSwitch}`}>
                <SlidingRadioSwitch
                  toggleLabel={""}
                  onToggle={(value) => setMarketingOptIn(!value)}
                  value={marketingOptIn}
                />
                <p className={styles.switchLabel}>
                  I consent to receiving occasional marketing communications and events invitation from Ahmed Seddiqi &
                  Sons, its affiliates, and group companies via phone, email, SMS, or WhatsApp channels.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.submitBtnContainer}>
            <Button
              clickHandler={validateForm}
              className={styles.submitBtn}
              title="Register"
              isLink={false}
              type="solid"
              color="metallic"
            />
          </div>
        </form>
      }
    </div>
  );
};

export default Register;
