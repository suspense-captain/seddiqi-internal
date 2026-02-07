import React, { useState } from "react";
import styles from "./myFavourites.module.scss";
import { CloseIcon, MapIcon } from "@assets/images/svg";
import { Button } from "@components/module";

const MyFavourites = ({user, token}) => {
  const userInfo = user;
  const tokenInfo = token;

  return (
    <>
      <div className={styles.myFavouritesContainer}>My FavouritesContainer</div>
    </>
  );
};

export default MyFavourites;
