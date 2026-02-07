import { CmsContext } from '@contexts/cmsContext';
import { CmsContent } from './utils';
import { stringify } from 'querystring';
import { createAppContext } from '@contexts/appContext';
import { standardizeLocale } from '@utils/helpers';

export type GetByIdRequest = { id: string };
export type GetByKeyRequest = { key: string };
export type SortByOrder = 'asc' | 'desc';
export type GetByFilterRequest = {
    filterBy: { path: string; value: any }[];
    sortBy?: {
        key: string;
        order?: SortByOrder;
    };
    page?: {
        size: number;
        cursor?: string;
    };
};

export type CmsRequest = GetByIdRequest | GetByKeyRequest | GetByFilterRequest;
export type CmsResponse = { content: CmsContent };

export type CmsFilterResponse = {
    responses: CmsResponse[];
    page: {
        responseCount: number;
        cursor?: string;
    };
};

function isGetByIdRequest(request: any): request is GetByIdRequest {
    return request && request['id'] !== undefined;
}

function isGetByFilterRequest(request: any): request is GetByFilterRequest {
    return request && request.filterBy && Array.isArray(request.filterBy);
}

const fetchContent = async (
    items: CmsRequest[],
    context: CmsContext,
    parameters = { depth: 'all', format: 'inlined' },
): Promise<(CmsContent | CmsFilterResponse | null)[]> => {
    const { cms } = await createAppContext();

    const host = context.stagingApi || `${cms.hubName}.cdn.content.amplience.net`;
    try {
        return await Promise.all(
            items.map((request: CmsRequest): Promise<CmsContent | CmsFilterResponse> => {
                if (isGetByFilterRequest(request)) {
                    let body = JSON.stringify({
                        ...request,
                        parameters,
                    });
                    return fetch(`https://${host}/content/filter`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body,
                    }).then((x) => x.json());
                } else {
                    let path = isGetByIdRequest(request) ? `id/${request.id}` : `key/${(request as GetByKeyRequest).key}`;
                    let params = {
                        ...parameters,
                        locale: standardizeLocale(context.locale),
                    };
                    return fetch(`https://${host}/content/${path}?${stringify(params)}`)
                        .then((x) => x.json())
                        .then((x) => x.content || null);
                }
            }),
        );
    } catch (err) {
        console.error('Error fetching content:', err);
        return items.map(() => null);
    }
};

export default fetchContent;
