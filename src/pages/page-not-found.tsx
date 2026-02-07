import Layout from "@components/layout";
import { Button, Typography } from "@components/module";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";
import { GetServerSidePropsContext } from "next";
import React from "react";
import styles from "./pageNotFound.module.scss";
import { pageNotFoundStaticData } from "@utils/data/english-arabic-static-data";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const locale = context?.locale?.toLowerCase();

  // ✅ For now, redirect to homepage if locale is 'ar-ae'
  if (locale === "ar-ae") {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }


 const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}page-not-found` },
      },
    },
    context
  );

  return {
    props: {
      ...data,
      locale: context?.locale 
    },
  };
}

export default function PageNotFound({locale, ...content }) {
  const contents = content?.content?.page?.needMoreHelp;
  const texts = pageNotFoundStaticData[locale] || pageNotFoundStaticData["en-ae"];

  return (
    <>
    <div className="error-page">
      <div className={styles.pageNotFoundStyle}>
        404
      </div>
      <Typography align="center" variant="h1">
        {texts?.title}
      </Typography>
      <Typography variant="p">
      {texts?.descriptionLine1}
      <br />
      {texts?.descriptionLine2}
      </Typography>
      <Button title={texts?.buttonText} type="transparent" color="metallic" />
    </div>

   {contents && <NeedMoreHelp {...contents} />}
    </>
  );
}

PageNotFound.Layout = Layout;
