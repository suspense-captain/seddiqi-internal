import React, { useEffect } from "react";
import Layout from "@components/layout";
import { GetServerSidePropsContext } from "next";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import Script from "next/script";
import { FooterBackToTop, RolexNavbar } from "@components/rendering/rolex";
import ContentBlock from "@components/module/contentBlock";
import { RolexComponentMapping } from "@utils/cms/config";
import compact from "lodash/compact";
import RolexIframeNewWatches from "@components/module/rolex-script";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}rolex/new-watches-2025` },
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

export default function RolexNewWatches2025(props) {
  const { content } = props;


  return (
    <div className="main-content rolex">
      {content?.page?.components[0] && (
        <RolexNavbar {...content?.page?.components[0]} />
      )}
      <RolexIframeNewWatches />

      {compact(content?.page?.components).map((content) => (
        <ContentBlock
          components={RolexComponentMapping}
          content={content}
          key={content?._meta.deliveryId}
        />
      ))}
      {content?.page?.footerBlock && (
        <FooterBackToTop
          contentImage={content?.page?.footerBlock?.footer?.media?.image}
          contentAlt={content?.page?.footerBlock?.footer?.media?.altText}
        />
      )}
    </div>
  );
}

RolexNewWatches2025.Layout = Layout;
