import React from "react";
import styles from "./noSearchResultFound.module.scss"; // Adjust based on your styles
import Typography from "../../typography";
import { NoResultsProps } from "@utils/models/search";

const NoSearchResultFound: React.FC<NoResultsProps> = ({ message }) => {
  return (
    <div>
      <Typography variant="p" className={styles.searchResultNotFoundMessage}>
        {`We couldn't find a match for"${message}". Please try another search`}
      </Typography>
    </div>
  );
};

export default NoSearchResultFound;