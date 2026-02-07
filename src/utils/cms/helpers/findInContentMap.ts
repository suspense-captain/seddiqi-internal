import { CmsContent } from '@utils/cms/utils';
import { CmsRequest } from '@utils/cms/fetchContent';
import { FetchMapOutput } from './fetchMap';


export function findInContentMap(
    map: FetchMapOutput<any, CmsRequest, CmsContent>,
    findFn: (node: CmsContent) => boolean
): CmsContent | null {
    const keys = Object.keys(map);
    for (let key of keys) {
        const entry = map[key];
        if (Array.isArray(entry)) {
            for (let subEntry of entry) {
                if (!subEntry) {
                    continue;
                }
                if (findFn(subEntry)) {
                    return subEntry;
                }
            }
        } else {
            if (!entry) {
                continue;
            }
            if (findFn(entry)) {
                return entry;
            }
        }
    }
    return null;
}
