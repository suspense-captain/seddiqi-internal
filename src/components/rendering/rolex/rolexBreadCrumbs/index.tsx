import React from "react";
import styles from "./rolexBreadCumbs.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight } from "@assets/images/svg";

const RolexBreadCumbs = ({ type = "green", storeName = "" }) => {
  const router = useRouter();
  const asPath = router.asPath;
  const segments = asPath.split("/").filter(Boolean);

  const isCPOHome = asPath === "/rolex/cpo";
  const isRolexHome = asPath === "/rolex";

  // Hide breadcrumbs on home pages
  if (segments.length === 0 || isCPOHome || isRolexHome) return null;

  const breadcrumbs = [];

  // Special handling for CPO pages
  const isCPOPage =
    (segments[0] === "products" && segments[1] === "rolex-cpo") || (segments[0] === "rolex" && segments[1] === "cpo");

  if (isCPOPage) {
    if (segments[0] === "products" && segments[1] === "rolex-cpo") {
      breadcrumbs.push({
        label: "Rolex CPO",
        path: "/rolex/cpo",
      });
      breadcrumbs.push({
        label: "rolex CPO",
        path: "/products/rolex-cpo",
      });
    } else {
      breadcrumbs.push({
        label: "Rolex CPO",
        path: "/rolex/cpo",
      });
    }

    // If URL is /products/rolex-cpo/[something]/[something-else]
    // Start at index 2 to skip "products" and "rolex-cpo"
    for (let i = 2; i < segments.length; i++) {
      const label = segments[i].replace(/-/g, " ");
      const path = "/" + segments.slice(0, i + 1).join("/");
      breadcrumbs.push({ label, path });
    }
  } else {
    // Default behavior for non-CPO paths
    segments.forEach((seg, index) => {
      const label = seg.replace(/-/g, " ");
      const path = "/" + segments.slice(0, index + 1).join("/");
      breadcrumbs.push({ label, path });
    });
  }

  return (
    <div
      className={`${styles.breadcrumbs} ${
        type === "black"
          ? styles.breadcrumbsBlack
          : type === "white"
          ? styles.breadcrumbsWhite
          : styles.breadcrumbsGreen
      }`}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <span key={index} className={styles.breadcrumbItem}>
            {index > 0 && <ArrowRight fill={"#147749"} className={styles.separatorIcon} />}
            <Link
              href={crumb.path}
              className={`${styles.breadcrumbLink} ${isLast ? styles.active : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast && storeName ? storeName : crumb.label}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default RolexBreadCumbs;
