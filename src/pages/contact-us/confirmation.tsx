import Layout from "@components/layout";
import { HeroBanner } from "@components/rendering";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}contact-us/confirmation` },
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
    },
  };
}

export default function ContactUsConfirmationPage({ ...content }) {
  const heroBanner = content?.content?.page?.heroBanner
  return <div>
    <HeroBanner banners={heroBanner?.banners} bannerType={heroBanner?.bannerType}  />
    {content?.content?.page.needMoreHelp &&  <NeedMoreHelp {...content?.content?.page.needMoreHelp} />}
  </div>;
}

ContactUsConfirmationPage.Layout = Layout;
