import React, { useContext } from "react";
import Layout from "@components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useContent } from "@contexts/withVisualizationContext";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getLocalePrefix, isEmpty, isKSALocale, mapToID, notNull } from "@utils/helpers";
import { CmsContent } from "@utils/cms/utils";
import ContentBlock from "@components/module/contentBlock";
import { RolexComponentMapping } from "@utils/cms/config";
import { RolexContext } from "@contexts/rolexContext";
import ContactForm from "@components/module/contactForm";
import RolexContactForm from "@components/rendering/rolex/rolexContactForm/rolexContactForm";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import { FooterBackToTop } from "@components/rendering/rolex";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let { slug } = context.params || {};
  const { vse } = context.query || {};
  const deliveryKey = slug ? (Array.isArray(slug) ? slug.join("/") : slug) : null;
  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}rolex/${deliveryKey}` },
      },
    },
    context
  );

  const needMoreHelp = await fetchStandardPageData(
    {
      content: {
        page: {
          key: "need-more-help",
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
      vse: vse || "",
      deliveryKey,
    },
  };
}

const RolexPage = (props) => {
  const { vse, content, needMoreHelp, deliveryKey } = props;
  const [page] = useContent(content.page, vse as string);
  const { rolexContact } = useContext(RolexContext);

  return (
    <div className={`main-content rolex ${deliveryKey && 'rolex-padding'}`}>
      {rolexContact ? (
        <>
          {page?.components
            ?.filter(notNull)
            ?.slice(0, 1)
            ?.map((cont: CmsContent, index: number) => (
              <ContentBlock
                components={RolexComponentMapping}
                content={cont}
                key={index}
              />
            ))}
          <RolexContactForm />
          {needMoreHelp?.content?.page && (
            <NeedMoreHelp {...needMoreHelp?.content?.page} />
          )}
        </>
      ) : (
        <>
          {page?.components
            ?.filter(notNull)
            .map((cont: CmsContent, index: number) => (
              <ContentBlock
                components={RolexComponentMapping}
                content={cont}
                key={index}
              />
            ))}
        </>
      )}
      {content?.page?.footerBlock && (
      <FooterBackToTop
        contentImage={content?.page?.footerBlock?.footer?.media?.image}
        contentAlt={content?.page?.footerBlock?.footer?.media?.altText}
      />
      )}
    </div>
  );
};

export default RolexPage;

RolexPage.Layout = Layout;
