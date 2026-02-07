import ContactForm from "@components/module/contactForm";
import ContentBlock from "@components/module/contentBlock";
import { RolexContext } from "@contexts/rolexContext";
import { RolexComponentMapping } from "@utils/cms/config";
import React, { useContext, useEffect, useState } from "react";
import FooterBackToTop from "../footerBackToTop";
import compact from "lodash/compact";

const RolexContentBlock = ({ content }) => {
    const { rolexContact, setRolexContact } = useContext(RolexContext);
    const [shouldRender, setShouldRender] = useState(false);
  
    // Effect to trigger render when rolexContact changes
    useEffect(() => {
      // Whenever rolexContact changes, set shouldRender to true
      setShouldRender(true);
    }, [rolexContact]);
  
    // Check if the content exists and should render
    if (!shouldRender) {
      return null; // Optionally, return null if you don't want to render immediately
    }
  return (
    <div className="main-content rolex">
      {rolexContact ? (
        <div>
          {compact(content?.page?.components?.slice(0, 1)).map((content) => (
            <ContentBlock components={RolexComponentMapping} content={content} key={content?._meta.deliveryId} />
          ))}
          <ContactForm />
        </div>
      ) : (
        <>
          {compact(content?.page?.components).map((content) => (
            <ContentBlock components={RolexComponentMapping} content={content} key={content?._meta.deliveryId} />
          ))}
          <FooterBackToTop
            contentImage={content?.page?.footerBlock?.footer?.media?.image}
            contentAlt={content?.page?.footerBlock?.footer?.media?.altText}
          />
        </>
      )}
    </div>
  );
};

export default RolexContentBlock;
