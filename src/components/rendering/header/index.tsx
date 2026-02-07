import { HeaderProvider } from "@contexts/headerContext";
import styles from "./header.module.scss";
import { DesktopHeader, MobileHeader } from "@components/module";
import { useWindowWidth } from "@utils/useCustomHooks";
import { useEffect, useState } from "react";

export default function Header({ ...props }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const windowWidth = useWindowWidth();
  return (
    <header className={styles.header}>{isClient && (windowWidth > 1299 ? <DesktopHeader /> : <MobileHeader />)}</header>
  );
}
 
 