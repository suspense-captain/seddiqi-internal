import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import compact from "lodash/compact";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { notNull } from "@utils/helpers";
import { CmsContent } from "@utils/cms/utils";
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

export default function BrandPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { vse, content } = props;
  const [page] = useContent(content.content, vse as string);

  return (
    <div className="brand-content">
      {page?.contentComponents
        ?.filter(notNull)
        .map((cont: CmsContent, index: number) => (
          <ContentBlock content={cont} key={index} />
        ))}
    </div>
  );
}

BrandPage.Layout = Layout;
