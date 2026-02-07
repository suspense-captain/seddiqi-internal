import TabbedNavigation from "@components/module/tabbedNavigation";
import styles from "./authentication.module.scss";
import SignIn from "./signIn";
import Register from "./register";
import ResetPassword from "./resetPassword";
import { useState } from "react";

const Authentication = () => {
  const [hideTabbedNavigation, setHideTabbedNavigation] = useState(false);
  let tabs = [
    {
      id: 1,
      title: "Sign In",
      content: <SignIn direction={"column"} />,
    },
    {
      id: 2,
      title: "Register",
      content: <Register gridColumn={"1fr"} hideTabbedNavigation={setHideTabbedNavigation}/>,
    },
    // {
    //   id: 3,
    //   title: "resetPassword",
    //   content: <ResetPassword />,
    // },
  ];

  return (
    <div className={styles.container}>
      <TabbedNavigation gap={0} className={styles.tabNavigation} tabs={tabs} hideTabs={hideTabbedNavigation} />
    </div>
  );
};

export default Authentication;
