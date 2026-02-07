import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import { createCmsContext } from "@contexts/cmsContext";
import { useContent } from "@contexts/withVisualizationContext";
import { RolexComponentMapping } from "@utils/cms/config";
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
const RolexPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { vse, content } = props;
  const [page] = useContent(content.content, vse as string);
  return (
    <div className="main-content rolex">
      {page?.components
        ?.filter(notNull)
        .map((cont: CmsContent, index: number) => (
          <ContentBlock
            components={RolexComponentMapping}
            content={cont}
            key={index}
          />
        ))}
    </div>
  );
};

export default RolexPage;

RolexPage.Layout = Layout;
