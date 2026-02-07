import React, { useEffect, useState } from "react";
import styles from "./addNewAddress.module.scss";
import { Button, Typography } from "@components/module";
import ArrowRight2 from "@assets/images/svg/ArrowRight2";
import ReactPhoneInput from "react-phone-number-input"; // Import react-phone-number-input
import 'react-phone-number-input/style.css'; // Import the default styles
import { DeleteIcon, EditIcon } from "@assets/images/svg";

const AddNewAddress = ({handleSecondLevelClick, handleThirdLevelClick, showSecondLevel, showThirdLevel, user, token}) => {
  const userInfo = user;
  const tokenInfo = token;

  const [salutation, setSalutation] = useState(userInfo.salutation || 'Mr.');
  const [firstName, setFirstName] = useState(userInfo.firstName || '');
  const [lastName, setLastName] = useState(userInfo.lastName || '');
  const [email, setEmail] = useState(userInfo.email || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneMobile.split(" ")[1] || '');
  const [areaCode, setAreaCode] = useState(userInfo.phoneMobile.split(" ")[0] || '');
  
  return (
    <div className={`${styles.addNewAddressContainer} ${(showSecondLevel && showThirdLevel) ? styles.isShowing : ""}`}>
      <ul className={styles.breadcrumbs}>
        <li onClick={() => handleSecondLevelClick("", false)}>
          My Profile
        </li>
        <li onClick={() => handleThirdLevelClick("", false)}>
          Address Book
        </li>
        <li className={styles.active}>
          Add New Address
        </li>
      </ul>

      <button className={styles.backButton} onClick={() => handleSecondLevelClick("", false)}><span>Back to My Profile</span></button>

      <Typography align="left" variant="h2" className={styles.mainTitle}>
        Add New Address
      </Typography>

      <div className={styles.detailsContainer}>

        <div className={styles.inputsWrapper}>
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
              <label>First Name*</label>
              <input 
                type="text"
                name="firstName"
                className={styles.text} 
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

            <div className={`${styles.inputs}`}>
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

            {/* <div className={`${styles.inputs} ${styles.phoneInputs}`}>
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewAddress;
