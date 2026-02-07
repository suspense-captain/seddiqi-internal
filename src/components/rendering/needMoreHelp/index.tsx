import { CallIcon, MailIcon, WhatsappIcon2 } from "@assets/images/svg";
import React from "react";
import styles from "./needMoreHelp.module.scss";
import { Image } from "@components/module";

const NeedMoreHelp = ({ ...content }) => {
  // console.log("NEED MORE HELP: ", content);

  const contents = content;

  return (
    <div className={`${[styles.needMoreHelpContainer]}`}>
      <div className={styles.content}>
        <h3>{contents.mainTitle}</h3>

        <ul className={styles.paragraphsContainer}>
          {contents.shortDescription.map((desc, index) => (
            <li key={index}>
              {desc.shortDescriptionText.map((text, textIndex) => (
                <p key={textIndex}>{text}</p>
              ))}
              {desc.linkText && (
                <p>
                  <a href={desc.linkUrl}>{desc.linkText}</a>
                </p>
              )}
            </li>
          ))}
        </ul>

        {contents.icons.length > 0 ? (
          <div className={styles.contactIcons}>
            {contents?.icons?.map((icon, index) => (
              <a href={icon.linkUrl} key={`${icon.linkUrl}-${index}}`}>
                <Image imgWidth="100%" height={"100%"} image={icon.media?.image} imageAltText={icon.media?.altText} />
              </a>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default NeedMoreHelp;
