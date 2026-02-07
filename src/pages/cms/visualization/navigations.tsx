import Layout from "@components/layout";
import StandaloneLayout from "@components/layout/standalone";
import { Footer, Header } from "@components/rendering";
import { createCmsContext } from "@contexts/cmsContext";
import { HeaderProvider } from "@contexts/headerContext";
import { SearchProvider } from "@contexts/searchContext";
import fetchHierarchy from "@utils/cms/fetchHierarchy";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { deliveryKey: deliveryKey } = context.query;
  const cmsContext = await createCmsContext(context.req);
  const [content] = await fetchHierarchy(
    [{ tree: { key: deliveryKey as string } }],
    cmsContext
  );
  const { res } = context;

  return {
    props: {
      content,
    },
  };
}

export default function Home({
  content
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //     <HeaderProvider headerData={{ ...headerData }}>
  //     <Header />
  //     <main className="mainClass">{children}</main>
  //     <Footer footerData={footerData} />
  //   </HeaderProvider>

  const isHeader = content.content._meta.deliveryKey === "headerNavigation";

  return (
    <>
      {isHeader ? (
        <SearchProvider>
          <HeaderProvider headerData={{ ...content }}>
            <Header />
          </HeaderProvider>
        </SearchProvider>
      ) : (
        <Footer footerData={content} />
      )}
    </>
  );
}

Home.Layout = StandaloneLayout;
