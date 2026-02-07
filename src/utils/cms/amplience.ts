import { ContentClient, ContentItem, ContentBody } from 'dc-delivery-sdk-js';
import {defaultClientConfig} from './config';
import { CmsHierarchyNode, CmsHierarchyRequest } from './utils';

const client = new ContentClient(defaultClientConfig);

export const getContentItemById = async (slotId: string): Promise<ContentItem> => {
    return (await client.getContentItemById(slotId)).toJSON();
}

export const getContentItemByKey = async (slotName: string): Promise<ContentItem> => {
    return (await client.getContentItemByKey(slotName)).toJSON();
}

export const getContentItemsByArrayIds = async (slotId: string[]): Promise<any> => {
    return client.getContentItemsById(slotId);
}

export const getContentItemByArrayKeys = async (slotName: string[]): Promise<any> => {
    return client.getContentItemsByKey(slotName);
}


export const getHierarchyChildren = async (parentId: string): Promise<any> => {
    let data = (await client.filterBy('/_meta/hierarchy/parentId', parentId).request({ depth: 'all', format: 'inlined' })).responses;

    let arr = [];
    data.map(({content}: any) => {
        arr.push({...content})
    });

    return arr;
}