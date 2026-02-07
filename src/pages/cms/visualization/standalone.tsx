import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import fetchStandardPageData from '@utils/cms/page/fetchStandardPageData';
import ContentBlock from '@components/module/contentBlock';
import StandaloneLayout from '@components/layout/standalone';


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { content: contentId } = context.query;
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
        },
    };
}

export default function Home({ content }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const contentData = content.content._meta.schema.includes("/rendering/banner") ? {_meta: content.content._meta, banners: [content.content]} : content.content;
    
    return <ContentBlock content={contentData} />;
}

Home.Layout = StandaloneLayout;
