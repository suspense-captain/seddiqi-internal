import { CmsContext } from '@contexts/cmsContext';
import fetchHierarchy from '../fetchHierarchy';
import { withRetry } from '@utils/helpers/withRetry';
import { FetchMapInput, FetchMapOutput, fetchMap } from '../helpers/fetchMap';
import { CmsHierarchyNode, CmsHierarchyRequest } from '../utils';

async function fetchHierarchyMap<T extends FetchMapInput<CmsHierarchyRequest>>(
    map: T,
    context: CmsContext
): Promise<FetchMapOutput<T, CmsHierarchyRequest, CmsHierarchyNode | null>> {
    return await withRetry(() => {
        return fetchMap(map, (items) => {
            return fetchHierarchy(items, context);
        });
    }, 'fetchHierarchyMap');
}

export default fetchHierarchyMap;
