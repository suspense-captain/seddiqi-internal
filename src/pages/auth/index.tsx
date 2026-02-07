import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Layout from "@components/layout";
import ContentBlock from "@components/module/contentBlock";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { CmsContent } from "@utils/cms/utils";
import Authentication from "@components/module/authenticaion";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug = [] } = context.params || {};
  const blogKey = Array.isArray(slug) ? slug.join("/") : slug;
  const data = await fetchStandardPageData(
    {
      content: {
        slots: [{ key: blogKey }],
      },
    },
    context
  );

  return {
    props: {
      ...data,
    },
  };
}

export default function Auth({
  content,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="af-main-content">
      <Authentication />
    </div>
  );
}

Auth.Layout = Layout;
