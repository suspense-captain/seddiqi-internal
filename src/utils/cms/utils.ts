export type CmsContent = {
    [key: string]: any;
};

export type CmsHierarchyRequest = { tree: {key: string} };

export type CmsHierarchyNode = {
    content: CmsContent;
    children: CmsHierarchyNode[];
};