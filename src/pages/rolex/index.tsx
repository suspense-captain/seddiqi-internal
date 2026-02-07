import { useContext } from "react";
import React from "react";
import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import compact from "lodash/compact";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";
import { RolexComponentMapping } from "@utils/cms/config";
import {
  FooterBackToTop
} from "@components/rendering/rolex";
import { RolexContext } from "@contexts/rolexContext";
import RolexContactForm from "@components/rendering/rolex/rolexContactForm/rolexContactForm";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import { BoutiqueBanner, Spacing } from "@components/rendering";
import RolexMap from "@components/rendering/rolex/rolexMap";

// import { getCustomer } from "@utils/sfcc-connector/dataService";
// import LoginForm from "@components/LoginForm";
// import RegistrationForm from "@components/RegistrationForm";
// import { getHierarchyChildren } from "@utils/cms/amplience";

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}rolex` },
      },
    },
    context
  );

  const needMoreHelp = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}need-more-help`,
        },
      },
    },
    context
  );

  const boutiqueBanner = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}rolex/contact-us`,
        },
      },
    },
    context
  );

  const rolexMap = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}rolex/rolex-map`,
        },
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
      needMoreHelp,
      boutiqueBanner,
      rolexMap
    },
  };
}

export default function RolexHome({ content, needMoreHelp, boutiqueBanner, rolexMap }) {
  const { rolexContact } = useContext(RolexContext);
  const rolexMapContent = rolexMap?.content?.page
  return (
    <div className="main-content rolex">
      {rolexContact ? (
        <div>
          {compact(content?.page?.components?.slice(0, 1)).map((content) => (
            <ContentBlock components={RolexComponentMapping} content={content} key={content?._meta.deliveryId} />
          ))}
          <RolexContactForm />

          {rolexMapContent && (
            <>
              <Spacing backgroundColor={rolexMapContent?.backgroundColor} />
                <RolexMap {...rolexMapContent} />
              <Spacing backgroundColor={rolexMapContent?.backgroundColor} />
            </>
          )}

          {boutiqueBanner?.content?.page && <BoutiqueBanner {...boutiqueBanner?.content?.page.boutiqueBanner} key={boutiqueBanner?.content?.page?._meta.deliveryId} />}
          {needMoreHelp?.content?.page && <NeedMoreHelp {...needMoreHelp?.content?.page} />}
        </div>
      ) : (
        <>
          {compact(content?.page?.components).map((content) => (
            <ContentBlock components={RolexComponentMapping} content={content} key={content?._meta.deliveryId} />
          ))}
          {content?.page?.footerBlock && (
          <FooterBackToTop
            contentImage={content?.page?.footerBlock?.footer?.media?.image}
            contentAlt={content?.page?.footerBlock?.footer?.media?.altText}
          />
          )}
        </>
      )}
    </div>
  );
}

RolexHome.Layout = Layout;
