import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import compact from "lodash/compact";
import { createCmsContext } from "@contexts/cmsContext";
import fetchContent from "@utils/cms/fetchContent";
import { useContent } from "@contexts/withVisualizationContext";

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

export default function Home({
  content,
  vse,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [page] = useContent(content.content, vse as string);

  return (
    <div className="main-content">
      {compact(page?.components).map((content) => (
        <ContentBlock content={content} key={content?._meta.deliveryId} />
      ))}
    </div>
  );
}

Home.Layout = Layout;
