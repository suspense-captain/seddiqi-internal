import React, { useContext } from "react";
import Image from "next/image";
import { getProducts } from "@utils/sfcc-connector";
import Layout from "@components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useContent } from "@contexts/withVisualizationContext";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import fetchPageData from "@utils/cms/page/fetchPageData";
import { getLocalePrefix, isEmpty, isKSALocale, mapToID, notNull } from "@utils/helpers";
import { CmsContent } from "@utils/cms/utils";
import ContentBlock from "@components/module/contentBlock";
import { RolexComponentMapping } from "@utils/cms/config";
import { RolexContext } from "@contexts/rolexContext";
import ContactForm from "@components/module/contactForm";
import RolexContactForm from "@components/rendering/rolex/rolexContactForm/rolexContactForm";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import { Spacing } from "@components/rendering";
import { RolexMap } from "@components/rendering/rolex";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let { slug } = context.params || {};
  const { vse } = context.query || {};
  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const deliveryKey = slug ? (Array.isArray(slug) ? slug.join("/") : slug) : null;


  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}rolex/cpo` },
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
      rolexMap,
      vse: vse || "",
      deliveryKey
    },
  };
}

const CPOPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { vse, content, needMoreHelp, rolexMap, deliveryKey } = props;
  const [page] = useContent(content.page, vse as string);
  const { rolexCPOContact } = useContext(RolexContext);
  const rolexMapContent = rolexMap?.content?.page

  console.log("deliveryKey", deliveryKey)

  return (
    <div className={`blog-content rolex ${deliveryKey && 'rolex-padding'}`}>
      {rolexCPOContact ? (
        <>
          {page?.components
            ?.filter(notNull)
            .slice(0, 1)
            ?.map((cont: CmsContent, index: number) => (
              <ContentBlock components={RolexComponentMapping} content={cont} key={index} />
            ))}
          <RolexContactForm />

         {rolexMapContent && (
            <>
              <Spacing backgroundColor={rolexMapContent?.backgroundColor} />
                <RolexMap {...rolexMapContent} />
              <Spacing backgroundColor={rolexMapContent?.backgroundColor} />
            </>
          )}
          

          {needMoreHelp?.content?.page && <NeedMoreHelp {...needMoreHelp?.content?.page} />}
        </>
      ) : (
        <>
          {page?.components?.filter(notNull).map((cont: CmsContent, index: number) => (
            <ContentBlock components={RolexComponentMapping} content={cont} key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default CPOPage;

CPOPage.Layout = Layout;
