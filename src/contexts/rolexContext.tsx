import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const RolexContext = createContext(undefined);
export const RolexProvider = ({ children }) => {
  const [rolexContact, setRolexContact] = useState(false);
  const [rolexCPOContact, setRolexCPOContact] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isRolexPage = router?.asPath?.includes("rolex") || router?.pathname?.includes("rolex/cpo");
    const isThankYouPage = router?.pathname?.includes("thank-you");
    
     if (!isRolexPage || isThankYouPage) {
      setRolexContact(false);
      setRolexCPOContact(false);
    }
    
  }, [router.query, router.pathname, router?.asPath]);

  const updateRolexContact = (value) => {
    const isFromPLP = router?.asPath?.includes("products/rolex")
    const isRolexCPOPath = router?.pathname.includes("rolex/cpo") || router?.asPath?.includes("rolex-cpo")

    if (!value) {
      setRolexContact(false);
      setRolexCPOContact(false);
      return null;
    }

    if(isRolexCPOPath) {
      setRolexCPOContact(true)
    } else {
      setRolexContact(value);
    }
    window?.scrollTo(0, 0);

    if(isFromPLP && isRolexCPOPath) {
      router.push("/rolex/cpo")
      setRolexCPOContact(true)
    }

    if(isFromPLP && !isRolexCPOPath) {
      router.push("/rolex")
      setRolexContact(value);
    }
  };
  return (
    <RolexContext.Provider value={{ rolexContact, updateRolexContact, rolexCPOContact, setRolexCPOContact }}>
      {children}
    </RolexContext.Provider>
  );
};
