import Layout from "@components/layout";
import ContactForm from "@components/module/contactForm";
import KsaContactForm from "@components/module/ksaContactForm";
import { Spacing } from "@components/rendering";
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
        page: { key: `${localePrefix}contact-us` },
      },
    },
    context
  );
  const ksaContactUs = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}ksa-contact-us`,
        },
      },
    },
    context
  );

  return {
    props: {
      ...data,
      locale: context?.locale,
      ksaContactUs,
    },
  };
}

export default function ContactUs({ ...content }) {
  const isKsa = content?.locale?.includes("-sa");
  return (
    <div>
      {isKsa ? (
        <>
          <Spacing />
          {content?.ksaContactUs?.content?.page && (
            <KsaContactForm {...content?.ksaContactUs?.content?.page} />
          )}
          <Spacing />
        </>
      ) : (
        <ContactForm />
      )}
      {content?.content?.page?.needMoreHelp && (
        <NeedMoreHelp {...content?.content?.page.needMoreHelp} />
      )}
    </div>
  );
}

ContactUs.Layout = Layout;
