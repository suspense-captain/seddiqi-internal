import Layout from "@components/layout";
import { Button, Typography } from "@components/module";
import React, { useEffect, useState } from "react";
import styles from "./pageNotFound.module.scss";
import { useRouter } from "next/navigation";

export default function Error500() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_POD_MAINTENANCE === "true") {
      router.push("/");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1600);
  }, [process.env, router, setIsLoading]);
  return (
    <>
      {!isLoading && (
        <div className="error-page error-500">
          <div className={styles.pageNotFoundStyle}>500</div>
          <Typography align="center" variant="h1">
            Internal server error
          </Typography>
          <Typography variant="p">
            We apologise for the inconvenience.
          </Typography>
          <Button title="Go to homepage" type="transparent" color="metallic" />
        </div>
      )}
    </>
  );
}
