import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { CmsContent } from "@utils/cms/utils";
import { useContent } from "@contexts/withVisualizationContext";
import { getLocalePrefix, isEmpty, isKSALocale, notNull } from "@utils/helpers";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug } = context.params || {};
  const { vse } = context.query || {};

  const slugArray = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const normalizedSlug = slugArray[0] === "blog" ? slugArray?.slice(1) : slugArray;
  const blogKey = normalizedSlug?.join("/");

 const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}blog/${blogKey}` },
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
    },
  };
}
export default function BlogDetail({
  content,
  vse,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [page] = useContent(content.page, vse as string);
  
  return (
    <div className="blog-main-content">
      {page?.contentComponents
        ?.filter(notNull)
        .map((content: CmsContent, index: number) => (
          <ContentBlock content={content} key={index} />
        ))}
    </div>
  );
}

BlogDetail.Layout = Layout;
