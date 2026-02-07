import React, { useState } from "react";
import styles from "./myProfile.module.scss";
import { Button, Typography } from "@components/module";
import Newsletter from "../newsletter";
import ArrowRight2 from "@assets/images/svg/ArrowRight2";
import PersonalDetails from "../personalDetails";
import AddressBook from "../addressBook";
import { useDeviceWidth } from "@utils/useCustomHooks";
import AddNewAddress from "../addNewAddress";

const MyProfile = ({handleDashboardClick, user, token, isShowing}) => {
  const [isDesktop] = useDeviceWidth();
  const userInfo = user;
  const tokenInfo = token;
  const [isSectionClicked, setIsSectionClicked] = useState(false);
  const [sectionToShow, setSectionToShow] = useState(isDesktop ? "personalDetails" : "");
  const [showSecondLevel, setShowSecondLevel] = useState(false);
  const [showThirdLevel, setShowThirdLevel] = useState(false);
  const [showProfileSection, setShowProfileSection] = useState(true);

  const defaultAddress = userInfo.addresses.find(address => address.preferred === true);

  //This is the click to go to the next section
  const handleSectionClick = (component, booleanVal) => {
    setSectionToShow(component);

    setTimeout(() => {
      setIsSectionClicked(prevState => !prevState);
    }, 1);

    setTimeout(() => {
      setShowSecondLevel(prevState => !prevState);
      setShowProfileSection(false);
    }, 300);
  };

  //This is the click to go back to the dashboard
  const handleSecondLevelClick = (component, booleanVal) => {
    setIsSectionClicked(booleanVal);
    setShowProfileSection(true);

    setTimeout(() => {
      setSectionToShow(component);
      setShowSecondLevel(prevState => !prevState);
      setShowThirdLevel(false);
    }, 300);
  };

  //This is the click to go back to the dashboard
  const handleThirdLevelClick = () => {
    setTimeout(() => {
      setShowThirdLevel(prevState => !prevState);
    }, 300);
  };

  return (
    <div className={`${styles.accountDetailsContainer} ${isSectionClicked ? styles.haveSecondLevel : ""} ${showThirdLevel ? styles.haveThirdLevel : ""}`}>
      <div className={`${styles.myProfileContainer} ${showProfileSection ? styles.profileSectionShowing : ""} ${(isShowing && !showSecondLevel) ? styles.isShowing : ""}`}>
        <button className={styles.backButton} onClick={() => handleDashboardClick("", false)}><span>Back to Dashboard</span></button>

        <Typography align="left" variant="h2" className={styles.profileTitle}>
          My Profile
        </Typography>

        <div className={styles.personalDetails}>
          <button className={styles.sectionHeader} onClick={() => handleSectionClick("personalDetails", showSecondLevel)}>
            <Typography align="left" variant="h2" className={styles.sectionTitle}>
              Personal Details
            </Typography>
            <ArrowRight2 className={styles.arrowIcon} />
          </button>

          <div className={styles.details}>
            <p>{userInfo.salutation && userInfo.salutation} {userInfo.firstName} {userInfo.lastName}</p>
            <p>{userInfo.email}</p>
            <p>{userInfo.phoneMobile}</p>
          </div>
        </div>

        <div className={styles.contactPreferences}>
          <Typography align="left" variant="h2" className={styles.sectionTitle}>
            Contact Preferences
          </Typography>
          <div className={styles.checkboxes}>
              <label>
                  <input type="checkbox" id="email" name="contact-methods" value="email" />
                  Email
              </label>
              <label>
                  <input type="checkbox" id="phone" name="contact-methods" value="phone" />
                  Phone
              </label>
              <label>
                  <input type="checkbox" id="whatsapp" name="contact-methods" value="whatsapp" />
                  Whatsapp
              </label>
          </div>
        </div>

        <div className={styles.addressBook}>
          <button className={styles.sectionHeader} onClick={() => handleSectionClick("addressBook", isSectionClicked)}>
            <Typography align="left" variant="h2" className={styles.addressTitle}>
              Address Book
            </Typography>
            <ArrowRight2 className={styles.arrowIcon} />
          </button>

          {userInfo.addresses ? (
            defaultAddress ? (
              <div className={`${styles.details} ${styles.addressDetails}` }>
                <p>{userInfo.addresses[0].addressId}</p>
                <p>{userInfo.addresses[0].address1}</p>
                <p>{userInfo.addresses[0].address2}</p>
                <p>{userInfo.addresses[0].city}</p>
                <p>{userInfo.addresses[0].phone}</p>
              </div>
            ) : "")
            : ""
          }
        </div>

        <Button
          clickHandler={() => console.log("")}
          className={styles.logoutButton}
          title="Logout"
          isLink={false}
          type="solid"
          color="black_dark"
        />

        <Newsletter />
      </div>

      {sectionToShow === "personalDetails" ?
        <PersonalDetails handleSecondLevelClick={handleSecondLevelClick} showSecondLevel={showSecondLevel} user={userInfo} token={tokenInfo} />
        : (sectionToShow === "addressBook" ?
        <AddressBook handleSecondLevelClick={handleSecondLevelClick} handleThirdLevelClick={handleThirdLevelClick} showSecondLevel={showSecondLevel} showThirdLevel={showThirdLevel} user={userInfo} token={tokenInfo} />
        : "")
      }

      <AddNewAddress handleSecondLevelClick={handleSecondLevelClick} handleThirdLevelClick={handleThirdLevelClick} showSecondLevel={showSecondLevel} showThirdLevel={showThirdLevel} user={userInfo} token={tokenInfo} />
    </div>
  );
};

export default MyProfile;
