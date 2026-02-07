import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const LANGUAGE_DICT = {
  en: "English",
  ar: "عربى",
};

export const COUNTRY_DICT = {
  ae: "UAE",
  sa: "KSA",
};
export const COUNTRY_DICT_ARABIC = {
  ae: "الإمارات",
  sa: "السعودية",
};

export type LanguageContextType = {
  language: string;
  country: string;
  handleLanguageChange?: (newLanguage: string, newCountry: string) => void;
  handleCountryChange?: (newLanguage: string, newCountry: string) => void;
  allLocales: readonly string[];
  handleCountryOnSAPageNotFound?: (newLanguage: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "en-ae",
  country: "ae",
  allLocales: ["en-ae", "ar-ae", "en-sa", "ar-sa"],
});

const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const {
    locale: activeLocale,
    locales: allLocales,
    asPath,
    pathname,
  } = router;

  const normalizedLocale = (activeLocale ?? "en-ae").toLowerCase();
  const [language, setLanguage] = useState<string>(normalizedLocale);
  const [country, setCountry] = useState<string>(normalizedLocale.split("-")[1]);

  useEffect(() => {
    const lang = (activeLocale ?? "en-ae").toLowerCase();
    const cntry = activeLocale.split("-")[1].toLowerCase();

    setLanguage(lang);
    setCountry(cntry);

    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute(
      "dir",
      lang.includes("ar-") ? "rtl" : "ltr"
    );
  }, [language, activeLocale]);

  const handleLanguageChange = (newLanguage: string, newCountry: string) => {
    setLanguage(`${newLanguage}-${newCountry}`.toLowerCase());
    setCountry(newCountry.toLowerCase());

    router.replace(pathname, asPath, {
      locale: `${newLanguage}-${newCountry}`.toLowerCase(),
    });
  };

  const handleCountryChange = (newLanguage: string, newCountry: string) => {
    setLanguage(`${newLanguage}-${newCountry}`.toLowerCase());
    setCountry(newCountry.toLowerCase());

    router.replace(pathname, asPath, {
      locale: `${newLanguage}-${newCountry}`.toLowerCase(),
    });
  };

  const handleCountryOnSAPageNotFound = (newCountry: string) => {
    setCountry(newCountry.toLowerCase());
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        country,
        handleLanguageChange,
        handleCountryChange,
        allLocales,
        handleCountryOnSAPageNotFound,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
