import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

const RolexAdobeScript = () => {
  const router = useRouter();
  const [showScript, setShowScript] = useState(false);

  useEffect(() => {
    const isRolexPage = router.asPath.startsWith("/rolex");
    setShowScript(isRolexPage);

    if (!isRolexPage) {
      document
        .querySelectorAll('script[src*="assets.adobedtm.com"]')
        .forEach((s) => s.remove());

      try {
        // @ts-ignore
        if (window._satellite) window._satellite = undefined;
        // @ts-ignore
        if (window.adobeDataLayer) window.adobeDataLayer = undefined;
        console.log("Cleaned up Adobe Launch scripts");
      } catch (err) {
        console.warn("Adobe cleanup error:", err);
      }
    }
  }, [router.asPath]);

  if (!showScript) return null;

  const hostedUrl = process.env.NEXT_PUBLIC_HOSTED_URL || "";
  const endpoint = /(uat|sit|dev|localhost)/i.test(hostedUrl)
    ? "launch-73c56043319a-staging.min.js"
    : "launch-5de25e657d80.min.js";

  return (
    <Script
      id="adobe-launch-script"
      strategy="afterInteractive"
      src={`https://assets.adobedtm.com/7e3b3fa0902e/7ba12da1470f/${endpoint}`}
      onLoad={() => console.log("Adobe Launch loaded")}
    />
  );
};

export default RolexAdobeScript;
