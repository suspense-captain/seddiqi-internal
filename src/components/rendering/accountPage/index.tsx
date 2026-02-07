import React, { useEffect, useRef, useState } from "react";
import styles from "./accountPage.module.scss";
import { CloseIcon, DeleteIcon, MapIcon } from "@assets/images/svg";
import { Button, Loader } from "@components/module";
import MyProfile from "../myProfile";
import Bookings from "../bookings";
import MyFavourites from "../myFavourites";
import { useDeviceWidth } from "@utils/useCustomHooks";
import PopupMessage from "../popupMessage";


const AccountPage = () => {
  const [isDesktop] = useDeviceWidth();
  const [activeComponent, setActiveComponent] = useState(!isDesktop ? "MyProfile" : "");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [mobileSectionClick, setMobileSectionClick] = useState(false); //This is used only for mobile screen
  const [isShowing, setIsShowing] = useState(false); //This is used only for mobile screen

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    const storedTokenInfo = localStorage.getItem("tokenInfo");

    if (storedUserInfo) {
      try {
        const parsedUser = JSON.parse(storedUserInfo);
        setUser(parsedUser);  // Set user state only once

        //console.log("token: ", token);
      } catch (error) {
        console.error("Failed to parse user info:", error);
        setUser(null);  // In case parsing fails, reset user state
      }
    }

    if (storedTokenInfo) {
      try {
        const parsedToken = JSON.parse(storedTokenInfo);
        setToken(parsedToken);  // Set user state only once

      } catch (error) {
        console.error("Failed to parse user info:", error);
        setToken(null);  // In case parsing fails, reset user state
      }
    }
  }, []);


  if (!user) {
    return <Loader />;  // Show loading state while user data is being fetched
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case "MyProfile":
      default:
        return <MyProfile handleDashboardClick={handleDashboardClick} isShowing={isShowing} user={user} token={token} />;
      case "Bookings":
        return <Bookings />;
      case "MyFavourites":
        return <MyFavourites user={user} token={token} />;
    }
  };

  const handleDashboardClick = (component, booleanVal) => {
    setActiveComponent(component);

    setTimeout(() => {
      setMobileSectionClick(prevState => !prevState);

      if(!isShowing){
        setIsShowing(prevState => !prevState);
      }
      else{
        setTimeout(() => {
          setIsShowing(prevState => !prevState);
        }, 299);
      }
    }, 1);
  };

  return (
    <>
      <div className={styles.accountPageContainer}>

        <div className={styles.welcomeMessage}>
          <h1 className={styles.title}>Welcome, {user.firstName}</h1>
          <p className={styles.description}>
            Welcome your Seddiqi Dashboard, where your journey towards horological
            excellence begins! We invite you to immerse yourself.
          </p>
        </div>

        <div className={`${styles.sectionContainer} ${mobileSectionClick === true ? styles.isClicked : ""}`}>
          <div className={`${styles.leftContainer} ${styles.leftContainerMobile} ${!isShowing ? styles.isShowing : ""}`}>
            <div className={styles.welcomeMessage}>
              <h1 className={styles.title}>Welcome, {user.firstName}</h1>
              <p className={styles.description}>
                Welcome your Seddiqi Dashboard, where your journey towards horological
                excellence begins! We invite you to immerse yourself.
              </p>
            </div>

            <div
              className={`${styles.navButton} ${
                activeComponent === "MyProfile" ? styles.activeButton : ""
              } ${styles.myProfile}`}
              onClick={() => handleDashboardClick("MyProfile", mobileSectionClick)}
              role="button" 
            >
              My Profile
            </div>
            {/* <div
              className={`${styles.navButton} ${
                activeComponent === "Bookings" ? styles.activeButton : ""
              } ${styles.bookings}`}
              onClick={() => handleDashboardClick("Bookings")}
              role="button"  
            >
              Bookings
            </div> */}
            <div
              className={`${styles.navButton} ${
                activeComponent === "MyFavourites" ? styles.activeButton : ""
              } ${styles.myFavourites}`}
              onClick={() => handleDashboardClick("MyFavourites", mobileSectionClick)}
              role="button"  
            >
              My Favourites
            </div>

            <Button
              clickHandler={() => console.log("")}
              className={styles.logoutButton}
              title="Logout"
              isLink={false}
              type="solid"
              color="black_dark"
            />

            {/* Help Section */}
            <div className={styles.helpSection}>
              <p className={styles.helpTitle}>Need help?</p>
              <p className={styles.helpDescription}>
                Feel free to contact us on our Customer service
              </p>

              <div className={styles.iconsContainer}>
                <MapIcon />
                <MapIcon />
                <MapIcon />
              </div>
            </div>
          </div>

          <div className={styles.leftContainer}>
            <div
              className={`${styles.navButton} ${
                activeComponent === "MyProfile" ? styles.activeButton : ""
              } ${styles.myProfile}`}
              onClick={() => setActiveComponent("MyProfile")}
              role="button" 
            >
              My Profile
            </div>
            {/* <div
              className={`${styles.navButton} ${
                activeComponent === "Bookings" ? styles.activeButton : ""
              } ${styles.bookings}`}
              onClick={() => setActiveComponent("Bookings")}
              role="button"  
            >
              Bookings
            </div> */}
            <div
              className={`${styles.navButton} ${
                activeComponent === "MyFavourites" ? styles.activeButton : ""
              } ${styles.myFavourites}`}
              onClick={() => setActiveComponent("MyFavourites")}
              role="button"  
            >
              My Favourites
            </div>

            <Button
              clickHandler={() => console.log("")}
              className={styles.logoutButton}
              title="Logout"
              isLink={false}
              type="solid"
              color="black_dark"
            />

            {/* Help Section */}
            <div className={styles.helpSection}>
              <p className={styles.helpTitle}>Need help?</p>
              <p className={styles.helpDescription}>
                Feel free to contact us on our Customer service
              </p>

              <div className={styles.iconsContainer}>
                <MapIcon />
                <MapIcon />
                <MapIcon />
              </div>
            </div>
          </div>

          <div className={`${styles.rightContainer}`}>
            {renderComponent()}
          </div>
        </div>
      </div>

      {/* <PopupMessage showPopup={true} haveButton={true} submitButtonText={"Save"} cancelButtonText={"Cancel"}>
        <div className={styles.popupMessageContainer}>
          <div className={styles.topContents}>
            <DeleteIcon />

            <p>Are you sure you want to<br />delete your account?</p>
          </div>
        </div>
      </PopupMessage> */}
    </>
  );
};

export default AccountPage;
