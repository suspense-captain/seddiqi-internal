import Layout from '@components/layout';
import { createCmsContext } from '@contexts/cmsContext';
import fetchContent from '@utils/cms/fetchContent';
import fetchStandardPageData from '@utils/cms/page/fetchStandardPageData';
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';


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
  
export default function Home({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return null;
}

Home.Layout = Layout;
