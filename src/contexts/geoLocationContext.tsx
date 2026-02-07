"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { LanguageContext } from "./languageContext";

type Geo = {
  country: string;
  city: string;
};

const expireAfterMs = 1000 * 60 * 60 * 24 * 7; //7 days

const GeoContext = createContext<Geo | undefined>(undefined);
export function GeoProvider({ children }: { children: ReactNode }) {
  const { handleCountryChange } = useContext(LanguageContext);

  const [geo, setGeo] = useState({ country: "", city: "" });

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1] || null
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const country = getCookie("geo-country") || "AE";
      const city = getCookie("geo-city") || "Unknown";

      setGeo({
        country: country || "AE",
        city: city || "Unknown",
      });

      console.log("Country from cookie: ", country);

      // Prevent redirect if already done
      const hasRedirected = localStorage.getItem("geo-redirected");
      const data = hasRedirected ? JSON.parse(hasRedirected) : null;
      const isExpired = data && Date.now() - data.timestamp > expireAfterMs;

      if (data && !isExpired) return;

      if (
        country.toLowerCase() ===
        process.env.NEXT_PUBLIC_DEFAULT_LOCATION_CODE_KSA?.toLowerCase()
      ) {
        localStorage.setItem(
          "geo-redirected",
          JSON.stringify({ redirected: "true", timestamp: Date.now() })
        );
        handleCountryChange?.("en", "SA");
      } else {
        localStorage.setItem(
          "geo-redirected",
          JSON.stringify({ redirected: "true", timestamp: Date.now() })
        );
        handleCountryChange?.("en", "AE");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>;
}
export function useGeo() {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error("useGeo must be used within a GeoProvider");
  }
  return context;
}
