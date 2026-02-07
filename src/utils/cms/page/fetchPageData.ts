
import { GetServerSidePropsContext } from 'next';
import { FetchMapInput } from '../helpers/fetchMap';
import { CmsRequest } from '../fetchContent';
import fetchContentMap from '../mapping/fetchContentMap';
import { createCmsContext } from '@contexts/cmsContext';
import { createAppContext } from '@contexts/appContext';
import { CmsHierarchyRequest } from '../utils';
import fetchHierarchyMap from '../mapping/fetchHierarchyMap';
import { enrichPageContent } from '../helpers/enrichPageContent';

export type FetchPageDataInput<
    CT extends FetchMapInput<CmsRequest>,
    CH extends FetchMapInput<CmsHierarchyRequest>
> = {
    content: CT;
    hierarchies?: CH;
};

/**
 * Fetches the core set of data required to render a page in parallel
 */
async function fetchPageData<
    CT extends FetchMapInput<CmsRequest>,
    CH extends FetchMapInput<CmsHierarchyRequest>,
>(input: FetchPageDataInput<CT, CH>, context: GetServerSidePropsContext) {
    const cmsContext = await createCmsContext(context.req);

    const content = await fetchContentMap(input.content, cmsContext);
    const hierarchies = await fetchHierarchyMap(input.hierarchies || {}, cmsContext);


    return {
        context: {
            cmsContext,
            appContext: await createAppContext(),
        },
        content: await enrichPageContent(content, cmsContext),
        hierarchies: await enrichPageContent(hierarchies, cmsContext),
    };
}

export default fetchPageData;
