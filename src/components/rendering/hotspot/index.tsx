import FrontViewHotspot from "../frontViewHotspot";
import SideViewHotspot from "../sideViewHotspot";
import styles from "./hotspot.module.scss";

const Hotspot= ({ ...content }) => {
  const frontViewData = content.frontView ? content.frontView[0] : null;
  const sideViewData = content.sideView ? content.sideView[0] : null;

  return (
    <div className={styles.hotspotContainer}>

      <div className={styles.hotspotWrapperTop}>
        <div className={styles.mainTitleDescContainer}>
          <h2>{content.mainTitle}</h2>
          <p>{content.mainDescription}</p>
        </div>

        {frontViewData && 
        <FrontViewHotspot frontViewData={frontViewData} />
        }
      </div>
      
      {sideViewData && 
      <div className={styles.hotspotWrapperBottom}>
        <SideViewHotspot sideViewData={sideViewData} />
      </div>
      }
      
    </div>
  )
};

export default Hotspot;
