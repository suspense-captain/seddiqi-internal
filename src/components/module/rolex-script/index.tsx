import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useState } from "react";

const RolexIframeNewWatches = () => {
  const bodyScriptText = `rlxCornerCallback = (Corner) => {rlxCornerCallback = null;const corner = new Corner({as: "standalone",lang: "en",consent: false,legal: "",destination: "new-watches-2025",});corner.mount("#rlxCorner");};`;
  const scriptURL = `https://cornersv7.rolex.com/retailer.js?apikey=fd5d8663fc8674a9ffab32649c3e39bf&callback=rlxCornerCallback`;

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "rlxCorner";
    script.innerHTML = bodyScriptText;
    document
      .getElementById("rolex-new-watches-iframe-container")
      .appendChild(script);

    const scriptMain = document.createElement("script");
    scriptMain.src = scriptURL;
    scriptMain.defer = true;
    scriptMain.async = true;
    document
      .getElementById("rolex-new-watches-iframe-container")
      .appendChild(scriptMain);

    const iframeInterval = setInterval(() => {
      let iframe = document.getElementById("rlx-corner") as HTMLIFrameElement;

      if (iframe) {
        iframe.style.minHeight = "2469.61px";

        setTimeout(() => {
          iframe.style.minHeight = iframe.scrollHeight.toString();
        }, 200);

        clearInterval(iframeInterval);
      }
    }, 100);
  }, []);

  return (
    <section id="rolex-new-watches-iframe-container">
      <Script
        defer
        async
        src="https://cornersv7.rolex.com/retailer.js?apikey=fd5d8663fc8674a9ffab32649c3e39bf&callback=rlxCornerCallback"
      />
    </section>
  );
};

export default RolexIframeNewWatches;
