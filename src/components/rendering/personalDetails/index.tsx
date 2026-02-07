import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./personalDetails.module.scss";
import { Button, Typography } from "@components/module";
import ArrowRight2 from "@assets/images/svg/ArrowRight2";
import ReactPhoneInput from "react-phone-number-input"; // Import react-phone-number-input
import 'react-phone-number-input/style.css'; // Import the default styles
import { updateCustomer } from "@utils/sfcc-connector/dataService";
import InputField from "@components/module/inputField";
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
import PasswordValidator from "@components/module/authenticaion/passwordValidator";

const PersonalDetails = ({handleSecondLevelClick, showSecondLevel, user, token}) => {
  const userInfo = user;
  const tokenInfo = token;

  const [email, setEmail] = useState<string>(userInfo.email || '');
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>(userInfo.firstName || '');
  const [lastName, setLastName] =useState<string>(userInfo.lastName || '');
  const [title, setTitle] = useState<string>(userInfo.salutation || 'Mr.');
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [phone, setPhone] = useState<string>("");
  const [areaCode, setAreaCode] = useState(userInfo.phoneMobile.split(" ")[0] || '');
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  
  console.log("userInfo3: ", userInfo);
  console.log("tokenInfo3: ", tokenInfo);

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
        setFirstName(value);
        setErrors((prev) => ({ ...prev, firstName: validateFirstName(value) }));
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
      // confirmEmail: validateConfirmEmail(email, confirmEmail),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      //phone: validatePhone(phone),
      title: validateTitle(title),
    });

    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // const [salutation, setSalutation] = useState(userInfo.salutation || 'Mr.');
  // const [firstName, setFirstName] = useState(userInfo.firstName || '');
  // const [lastName, setLastName] = useState(userInfo.lastName || '');
  // const [email, setEmail] = useState(userInfo.email || '');
  // const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneMobile.split(" ")[1] || '');
  // const [areaCode, setAreaCode] = useState(userInfo.phoneMobile.split(" ")[0] || '');

  /*const handleSaveChanges = async () => {
    try {
      const userData = {
        salutation: salutation,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneMobile: areaCode + " " + phoneNumber
      }

      const method = "PATCH";
      const customerId = tokenInfo.customer_id;
      const access_token = tokenInfo.access_token;
      
      const response = await updateCustomer({
        userData,
        method,
        customerId,
        access_token
      });

      const data = await response.json();
      console.log("Customer update successful:", data);

    } catch (error) {
      console.error("Error updating customer", error);
    }
  };*/

  return (
    <div className={`${styles.personalDetailsContainer} ${showSecondLevel ? styles.isShowing : ""}`}>
      <ul className={styles.breadcrumbs}>
        <li onClick={() => handleSecondLevelClick("", false)}>
          My Profile
        </li>
        <li className={styles.active}>
          Profile Details
        </li>
      </ul>

      <button className={styles.backButton} onClick={() => handleSecondLevelClick("", false)}><span>Back to My Profile</span></button>

      <Typography align="left" variant="h2" className={styles.mainTitle}>
        Personal Details
      </Typography>

      <div className={styles.detailsContainer}>
        <Typography align="left" variant="h2" className={styles.detailsTitle}>
          Personal Information
        </Typography>

        <div className={styles.inputsWrapper}>
          <div className={styles.inputsContainer}>
            <div className={`${styles.inputs}`}>
              <div className={styles.selectContainer}>
                <InputField
                  name="title"
                  showLabel={true}
                  label="Title"
                  value={title}
                  onChange={handleInputChange}
                  options={["Mr", "Mrs", "Ms"]}
                  errorMessage={errors.title}
                  required
                  optionFull={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.inputsWrapper}>
          <div className={styles.inputsContainer}>
            <div className={styles.inputs}>
              <InputField
                type="text"
                showLabel={true}
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
                label="First Name"
                errorMessage={errors.firstName}
                required
              />
            </div>

            <div className={styles.inputs}>
              <InputField
                type="text"
                showLabel={true}
                name="lastName"
                value={lastName}
                onChange={handleInputChange}
                label="Last Name"
                errorMessage={errors.lastName}
                required
              />
            </div>
          </div>

          <div className={styles.inputsContainer}>
            <div className={styles.inputs}>
              <InputField
                type="text"
                showLabel={true}
                name="email"
                value={email}
                onChange={handleInputChange}
                label="Email"
                errorMessage={errors.email}
                required
              />
            </div>

            <div className={`${styles.inputs} ${styles.phoneInputs}`}>
              <ReactPhoneInput
                international
                defaultCountry="AE" // Set default country code
                value={areaCode} // Bind the state to the input value
                onChange={setAreaCode} // Update the phone number state when the input changes
                className={styles.text} // Use the same styles as other inputs
                placeholder="Enter your phone number"
              />

              <InputField
                type="text"
                showLabel={false}
                name="phone"
                value={phone}
                onChange={handleInputChange}
                label="Phone"
                errorMessage={errors.phone}
                required
              />
            </div>
          </div>
        </div>

        {/* <div className={styles.inputsWrapper}>
          <div className={styles.inputsContainer}>
            <div className={styles.inputs}>
              <label>Title*</label>

              <div className={styles.selectContainer}>
                <select 
                  name="salutation" 
                  id="salutation"
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>
              
            </div>
          </div>

          <div className={styles.inputsContainer}>
            <div className={styles.inputs}>
            <InputField
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
              label="Last Name"
              errorMessage={errors.lastName}
              required
            />
            </div>

            <div className={styles.inputs}>
              <label>Last Name*</label>
              <input 
                type="text" 
                name="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className={styles.text} />
            </div>
          </div>

          <div className={styles.inputsContainer}>
            <div className={styles.inputs}>
              <label>Email*</label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className={styles.text} />
            </div>

            <div className={`${styles.inputs} ${styles.phoneInputs}`}>
              <ReactPhoneInput
                international
                defaultCountry="AE" // Set default country code
                value={areaCode} // Bind the state to the input value
                onChange={setAreaCode} // Update the phone number state when the input changes
                className={styles.text} // Use the same styles as other inputs
                placeholder="Enter your phone number"
              />

              <input 
                type="number" 
                name="phone" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.text} />
            </div>
          </div>
        </div> */}
      </div>

      <Button
        clickHandler={null}
        className={styles.saveChangesButton}
        title="Save Changes"
        isLink={false}
        type="solid"
        color="white"
      />

      <div className={styles.detailsContainer}>
        <Typography align="left" variant="h2" className={styles.detailsTitle}>
          My Interest
        </Typography>

        <div className={styles.checkboxes}>
          <label>
              <input type="checkbox" id="watches" name="my-interests" value="Watches" />
              Watches
          </label>
          <label>
              <input type="checkbox" id="jewellery" name="my-interests" value="Jewellery" />
              Jewellery
          </label>
          <label>
              <input type="checkbox" id="investments" name="my-interests" value="Investments" />
              Investments
          </label>
          <label>
              <input type="checkbox" id="horology" name="my-interests" value="Horology" />
              Horology
          </label>
          <label>
              <input type="checkbox" id="new-launches" name="my-interests" value="New Launches" />
              New Launches
          </label>
        </div>
      </div>

      <div className={styles.detailsContainer}>
        <Typography align="left" variant="h2" className={styles.detailsTitle}>
          Change Password
        </Typography>

        <div className={styles.inputsWrapper}>
          <form className={styles.inputsContainer}>
            <div className={styles.inputs}>
              <InputField
                type="password"
                showLabel={true}
                name="password"
                value={password}
                onChange={handleInputChange}
                label="Password"
                errorMessage={errors.password}
                required
              />
              {/* <PasswordValidator password={password} validations={passwordValidations} /> */}
            </div>

            <div className={styles.inputs}>
              <InputField
                type="password"
                showLabel={true}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                label="Confirm Password"
                errorMessage={errors.confirmPassword}
                required
              />
            </div>
          </form>
        </div>
      </div>

      <Button
        clickHandler={null}
        className={styles.saveChangesButton}
        title="Save Changes"
        isLink={false}
        type="solid"
        color="white"
      />
    </div>
  );
};

export default PersonalDetails;
