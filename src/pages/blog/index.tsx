import Layout from '@components/layout';
import ContentBlock from '@components/module/contentBlock';
import compact from "lodash/compact";
import fetchStandardPageData from '@utils/cms/page/fetchStandardPageData';
import { getLocalePrefix, isEmpty } from '@utils/helpers';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';


export async function getServerSideProps(context: GetServerSidePropsContext) {

    const { vse } = context.query || {};
    const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

    const data = await fetchStandardPageData(
        {
          content: {
            page: { key: `${localePrefix}blog` },
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
export default function Blog({ content }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
      <div className="blog-main-content">
        {compact(content?.page?.contentComponents).map((content) => (
          <ContentBlock content={content} key={content?._meta.deliveryId} />
        ))}
      </div>
    );
  }
  
  Blog.Layout = Layout;
