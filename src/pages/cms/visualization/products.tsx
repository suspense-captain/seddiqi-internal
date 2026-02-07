import Layout from '@components/layout';
import fetchStandardPageData from '@utils/cms/page/fetchStandardPageData';
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { content: contentId } = context.query;
    const { res } = context;
    const data = await fetchStandardPageData(
        {
            content: {
                content: { id: contentId as string },
            },
        },
        context
    );


    const dk = data?.content?.content?._meta.deliveryKey;
    const categoryName = dk.split('products/')[1];

    if (res) {
        const queryArgs = [];
        for (let key of Object.keys(context.query)) {
            queryArgs.push([key, context.query[key]]);
        }

        res.setHeader('Cache-Control', 'no-cache ');
        res.writeHead(301, {
            Location:
                `/products/${categoryName}?` +
                queryArgs.map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`).join('&'),
        });
        
        res.end();
    }

    return {
        props: {},
    };
}

export default function Home({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <>hello world</>;
}

Home.Layout = Layout;
