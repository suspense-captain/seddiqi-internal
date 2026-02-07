import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import fetchPageData from "@utils/cms/page/fetchPageData";
import { getLocalePrefix, isEmpty, isKSALocale, mapToID, notNull } from "@utils/helpers";
import { CmsContent } from "@utils/cms/utils";
import ContentBlock from "@components/module/contentBlock";
import Layout from "@components/layout";
import { useContent } from "@contexts/withVisualizationContext";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug } = context.params || {};
  const deliveryKey = Array.isArray(slug) ? slug.join("/") : (slug as string);
  const { vse } = context.query || {};

  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  
  /** For VSE handler */
  if (deliveryKey.includes("home") || deliveryKey === "/" || deliveryKey.includes("sw.js")) {
    return {
        redirect: {
            destination: isKSALocale(context?.locale) ? "/en-sa" : "/",
        },
    };
  }
  

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}${deliveryKey}` },
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
      vse: vse || ""
    },
  };
}

export default function LandingPage({
  content,
  vse
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [page] = useContent(content.page, vse as string);
  
  return (
    <div className="main-content">
      {page?.components?.filter(notNull)
        .map((content: CmsContent, index: number) => (
          <ContentBlock content={content} key={index} />
        ))}
    </div>
  );
}

LandingPage.Layout = Layout;
