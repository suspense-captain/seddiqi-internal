import React, { ReactNode, useEffect, useState } from "react";
import styles from "./popupMessage.module.scss";
import { Button, Typography } from "@components/module";
import { CircleRightIcon, CloseIcon, CloseIconV2, DeleteIcon } from "@assets/images/svg";

interface PopupMessageProps {
  children: ReactNode;
  showPopup: boolean;
  haveButton: boolean;
  submitButtonText: string;
  cancelButtonText: string;
}

const PopupMessage: React.FC<PopupMessageProps> = ({children, showPopup, haveButton, submitButtonText, cancelButtonText}) => {
  const [isShowingPopup, setIsShowingPopup] = useState(showPopup);

  useEffect(() => {
    setIsShowingPopup(true);
  }, []);
  
  return (
    <div className={`${styles.accountPopupContainer} ${isShowingPopup ? styles.isShowing : ""}`}>
      <div className={styles.underlay} onClick={() => setIsShowingPopup(false)}></div>

      <div className={styles.popupContentsContainer}>
        <button className={styles.closeButton} onClick={() => setIsShowingPopup(false)}>
          <CloseIconV2 />
        </button>

        {children}

        {haveButton &&
        <div className={styles.bottomContents}>

          {submitButtonText !== "" ?
            <Button
              clickHandler={null}
              className={styles.saveButton}
              title={submitButtonText}
              isLink={false}
              type="solid"
              color="black_dark"
            />
          : ""}

          {cancelButtonText !== "" ?
            <Button
              clickHandler={() => setIsShowingPopup(false)}
              className={styles.cancelButton}
              title={cancelButtonText}
              isLink={false}
              type="plain"
              color="black_dark"
            />
          : ""}
        </div>
        }
        
        {/* {popupToShow === "deleteAccount" &&
          <>
          <div className={styles.topContents}>
            <DeleteIcon />

            <p>Are you sure you want to<br />delete your account?</p>
          </div>

          <div className={styles.bottomContents}>
            <Button
              clickHandler={null}
              className={styles.saveButton}
              title="Save"
              isLink={false}
              type="solid"
              color="black_dark"
            />

            <Button
              clickHandler={() => setIsShowingPopup(false)}
              className={styles.cancelButton}
              title="Cancel"
              isLink={false}
              type="plain"
              color="black_dark"
            />
          </div>
          </>
        }

        {popupToShow === "deleteAccountSuccess" &&
          <>
          <div className={styles.topContents}>
            <CircleRightIcon />

            <p className={styles.allCaps}>REQUEST SUBMITTED.</p>
          </div>

          <div className={styles.bottomContents}>
            <p>An email will be send to your account confirming your account has been deleted.</p>
          </div>
          </>
        }

        {popupToShow === "addressSaved" &&
          <>
          <div className={styles.topContents}>
            <CircleRightIcon />

            <p>Your address has been<br />saved successfully</p>
          </div>
          </>
        }

        {popupToShow === "detailsSaved" &&
          <>
          <div className={styles.topContents}>
            <CircleRightIcon />

            <p>Your details have been saved successfully</p>
          </div>
          </>
        }

        {popupToShow === "unsubscribePrompt" &&
          <>
          <div className={styles.topContents}>
            <DeleteIcon />

            <p>Are you sure you want to unsubscribe from the<br />Ahmed Seddiqi Newsletter?</p>
          </div>

          <div className={styles.bottomContents}>
            <Button
              clickHandler={null}
              className={styles.saveButton}
              title="Yes, Unsubscribe me"
              isLink={false}
              type="solid"
              color="black_dark"
            />

            <Button
              clickHandler={() => setIsShowingPopup(false)}
              className={styles.cancelButton}
              title="Cancel"
              isLink={false}
              type="plain"
              color="black_dark"
            />
          </div>
          </>
        }

        {popupToShow === "unsubscribeSuccess" &&
          <>
          <div className={styles.topContents}>
            <CircleRightIcon />

            <p>Your email has been unsubscribed<br />from the Newsletter</p>
          </div>
          </>
        }

        {popupToShow === "communicationPreference" &&
          <>
          <div className={styles.topContents}>
            <p>Do you wanna save your<br />communication preferences?</p>
          </div>

          <div className={styles.bottomContents}>
            <Button
              clickHandler={null}
              className={styles.saveButton}
              title="Yes"
              isLink={false}
              type="solid"
              color="black_dark"
            />

            <Button
              clickHandler={() => setIsShowingPopup(false)}
              className={styles.cancelButton}
              title="No"
              isLink={false}
              type="plain"
              color="black_dark"
            />
          </div>
          </>
        }

        {popupToShow === "error" &&
          <>
          <div className={styles.topContents}>
            <CloseIconV2 fill={"#B30003"} />

            <p>An error occurred during your request, please try later.</p>
          </div>
          </>
        } */}
      </div>
    </div>
  );
};

export default PopupMessage;
