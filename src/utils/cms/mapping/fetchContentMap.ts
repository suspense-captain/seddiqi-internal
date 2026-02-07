import { CmsContext } from '@contexts/cmsContext';
import { CmsContent } from '../utils';
import fetchContent, { CmsRequest } from '../fetchContent';

import { withRetry } from '@utils/helpers/withRetry';
import { FetchMapInput, FetchMapOutput, fetchMap } from '../helpers/fetchMap';

async function fetchContentMap<T extends FetchMapInput<CmsRequest>>(
    map: T,
    context: CmsContext
): Promise<FetchMapOutput<T, CmsRequest, CmsContent | null>> {
    return await withRetry(() => {
        return fetchMap(map, (items) => {
            return fetchContent(items, context);
        });
    }, 'fetchContentMap');
}

export default fetchContentMap;
