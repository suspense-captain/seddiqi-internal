import React, { useEffect, useState } from "react";
import styles from "./addressBook.module.scss";
import { Button, Typography } from "@components/module";
import ArrowRight2 from "@assets/images/svg/ArrowRight2";
import ReactPhoneInput from "react-phone-number-input"; // Import react-phone-number-input
import 'react-phone-number-input/style.css'; // Import the default styles
import { updateCustomer } from "@utils/sfcc-connector/dataService";
import { DeleteIcon, EditIcon } from "@assets/images/svg";

const AddressBook = ({handleSecondLevelClick, handleThirdLevelClick, showSecondLevel, showThirdLevel, user, token}) => {
  const userInfo = user;
  const tokenInfo = token;

  const [selected, setSelected] = useState(null);

  const checkOnlyOne = (index) => {
    if (selected === index) {
      setSelected(null);
    } else {
      setSelected(index);
    }
  };
  
  return (
    <div className={`${styles.addressBookContainer} ${(showSecondLevel && !showThirdLevel) ? styles.isShowing : ""}`}>
      <ul className={styles.breadcrumbs}>
        <li onClick={() => handleSecondLevelClick("", false)}>
          My Profile
        </li>
        <li className={styles.active}>
          Address Book
        </li>
      </ul>

      <button className={styles.backButton} onClick={() => handleSecondLevelClick("", false)}><span>Back to My Profile</span></button>

      <Typography align="left" variant="h2" className={styles.mainTitle}>
        Address Book
      </Typography>

      {userInfo.addresses && userInfo.addresses.length > 0 ? (
        <>
          {userInfo.addresses.map((address, index) => (
            <div className={styles.detailsContainer} key={index}>

              <div className={styles.detailsWrapper}>
                <div className={styles.detailsTitleEditContainer}>
                  <Typography align="left" variant="h2" className={styles.detailsTitle}>
                  {address.addressId}
                  </Typography>

                  <button className={styles.editButton}><EditIcon /></button>
                </div>

                <div className={`${styles.details} ${styles.addressDetails}` }>
                  <p>{address.firstName} {address.lastName}</p>
                  <p>{address.address1}</p>
                  <p>{address.address2}</p>
                  <p>{address.city}</p>
                  <p>{address.phone}</p>
                </div>
              </div>

              <div className={styles.defaultAddressEditContainer}>
                <div className={styles.checkboxes}>
                  <label>
                      <input type="checkbox"
                      id={"checkbox" + (index + 1).toString()}
                      checked={address.preferred || selected === index}
                      onChange={() => checkOnlyOne(index)} />
                      {address.preferred || selected === index ? "Default Address" : "Make Default Address"}
                  </label>
                </div>

                <button className={styles.deleteButton}>
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}

          <Button
            clickHandler={handleThirdLevelClick}
            className={styles.addAddressButton}
            title="Add New Address"
            isLink={false}
            type="solid"
            color="white"
          />
        </>
      ) : 
      <div className={`${styles.detailsContainer} ${styles.noAddress}`}>
        <p>You don’t have saved addresses</p>

        <Button
          clickHandler={handleThirdLevelClick()}
          className={styles.addAddressButton}
          title="Add New Address"
          isLink={false}
          type="solid"
          color="white"
        />
      </div>
    }
    </div>
  );
};

export default AddressBook;
