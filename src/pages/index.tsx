import React, { useContext, useState } from "react";
import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import compact from "lodash/compact";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";
import { LanguageContext } from "@contexts/languageContext";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { vse, content: contentId } = context.query || {};

 const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}homepage` },
      },
    },
    context
  );

  if (isEmpty(data?.content?.page)) {
    return {
      redirect: {
        destination: `/${localePrefix}page-not-found`,
      },
    };
  }

  return {
    props: {
      ...data,
      locale: context?.locale,
    },
  };
}

export default function Home({
  content,
  locale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <div className="main-content">
      {compact(content?.page?.components).map((content) => (
        <ContentBlock content={content} key={content?._meta.deliveryId} />
      ))}
    </div>
  );
}

Home.Layout = Layout;
