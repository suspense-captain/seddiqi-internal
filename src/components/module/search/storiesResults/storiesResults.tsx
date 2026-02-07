import React from "react";
import styles from "./storiesResults.module.scss";
import Typography from "../../typography";
import StoryCard from "../../cards/storyCard";
import { Button } from "@components/module";
import { useRouter } from "next/router";
import { useSearchContext } from "@contexts/searchContext";

const StoriesResults = ({ storiesResults }) => {
  const { setStoriesResults } = useSearchContext();
  const router = useRouter();

  // const handleViewAllClick = () => {
  //   const serializedResults = JSON.stringify(storiesResults);
  //    router.push(`/stories?recommendations=${encodeURIComponent(serializedResults)}`);
  // };


  const handleViewAllClick = () => {
    if (typeof window !== "undefined") {
      // Store the full `storiesResults` in sessionStorage
      sessionStorage.setItem("storiesResults", JSON.stringify(storiesResults));
      window.open("/stories", "_blank");
    }
  };
  return (
    <div className={styles.storiesContainer}>
      <Typography variant="p" className={styles.searchStoryTitle}>
        Recommmended Stories
      </Typography>
      <div className={styles.storyCards}>
        {storiesResults.slice(0, 6).map((story, index) => (
          <div className={styles.storyCard} key={index}>
            <StoryCard item={story} />
          </div>
        ))}
      </div>
      {storiesResults.length > 2 && (
        <div className={styles.viewAllBtnContainer}>
          <Button
            isLink={false}
            link={""}
            className={styles.viewAllBtn}
            title={"View All"}
            color="black_dark"
            type={"plain"}
            clickHandler={handleViewAllClick}
          />
        </div>
      )}
    </div>
  );
};

export default StoriesResults;