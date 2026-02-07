import React from "react";
import styles from "./rolexIframe.module.scss";
import { VideoIframe } from "@components/module";

const RolexIframe = (content) => {
  const { iframeUrl, backgroundColor } = content;
  if (!iframeUrl) {
    return null;
  }

  return (
    <div className={`${styles.rolexVideoIframeWrapper} ${backgroundColor}` }>
      <div className={`${styles.rolexVideoIframeContainer}`}>
        <VideoIframe iframeUrl={iframeUrl} />
      </div>
    </div>
  );
};

export default RolexIframe;
