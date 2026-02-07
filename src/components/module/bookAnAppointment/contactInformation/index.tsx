import styles from "./contactInformation.module.scss";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader } from "@components/module";

const ContactInformation = () => {
  const [user, setUser] = useState(null);
  const { data: userSession, status } = useSession(); // Destructure status and data from useSession

  useEffect(() => {
    // Only set user once session is loaded
    if (userSession?.user) {
      setUser(userSession.user);
    }
  }, [userSession]); // Trigger effect whenever userSession changes

  // Handle the loading state, and render null or a loading spinner if session is still loading
  if (status === "loading") {
    return <Loader />;
  }

  return user && (
    <div className={styles.contactContainer}>
      <h4>Contact Details</h4>
      <div className={styles.contactInfo}>
        <p>{user.firstName}</p>
        <p>{user.email}</p>
        <p>{user.phoneMobile}</p>
      </div>
    </div>
  );
};

export default ContactInformation;
