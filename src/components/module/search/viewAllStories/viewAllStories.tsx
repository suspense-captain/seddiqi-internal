import React from "react";
import styles from "./viewAllStories.module.scss";
import Typography from "../../typography";
import StoryCard from "../../cards/storyCard";
import { Button } from "@components/module";

const ViewAllStories = ({ storiesResults }) => {
  return (
    <div className={styles.storiesContainer}>
      <Typography variant="h3" className={styles.searchStoryTitle}>
        Results for Stories
      </Typography>
      <div className={styles.storyCards}>
        {storiesResults.map((story, index) => (
          <div className={styles.storyCardStyles} key={index}>
            <StoryCard item={story} className="customStoryCardStyle" />
            <div className={styles.buttonContainer}>
              <Button
                isLink={true}
                className={styles.storyBtn}
                title={"Discover The Collection"}
                link={"/"}
                type={"plain"}
                color={"black-dark"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllStories;