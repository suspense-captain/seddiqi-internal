import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import { createCmsContext } from "@contexts/cmsContext";
import { useContent } from "@contexts/withVisualizationContext";
import fetchContent from "@utils/cms/fetchContent";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { CmsContent } from "@utils/cms/utils";
import { notNull } from "@utils/helpers";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { vse, content: contentId } = context.query || {};

  const data = await fetchStandardPageData(
    {
      content: {
        content: { id: contentId as string },
      },
    },
    context
  );

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
    const [page] = useContent(content.content, vse as string);
    
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