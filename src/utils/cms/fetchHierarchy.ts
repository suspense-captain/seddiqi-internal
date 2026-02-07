import { CmsContext } from "@contexts/cmsContext";
import { CmsContent, CmsHierarchyNode, CmsHierarchyRequest } from "./utils";

import fetchContent, { GetByFilterRequest } from "./fetchContent";

async function getChildren(
  nodeId: string,
  context: CmsContext
): Promise<CmsHierarchyNode[]> {
  const childrenRequest: GetByFilterRequest = {
    filterBy: [
      {
        path: "/_meta/hierarchy/parentId",
        value: nodeId,
      },
    ],
    sortBy: {
      key: "default",
      order: "asc",
    },
  };
  const [children] = await fetchContent([childrenRequest], context, {
    depth: "all",
    format: "inlined",
  });
  const responses: any[] = children?.responses || [];
  const subChildren = await Promise.all(
    responses.map((child: any) => {
      return getChildren(child.content._meta.deliveryId, context);
    })
  );
  responses.forEach((element: any, i: number) => {
    responses[i].children = subChildren[i];
  });

  return responses;
}

async function fetchHierarchy(
  items: CmsHierarchyRequest[],
  context: CmsContext
): Promise<(CmsHierarchyNode | null)[]> {
  return await Promise.all(
    items.map(async (item) => {
      const [rootNode] = await fetchContent([{ key: item.tree.key }], context, {
        depth: "root",
        format: "linked",
      });
      if (!rootNode) return null;
      const children: CmsHierarchyNode[] = await getChildren(
        (rootNode as any)._meta.deliveryId,
        context
      );
      const response: any = {
        content: rootNode,
        children: children,
        root: {
          key: (rootNode as any)._meta.deliveryKey,
          name: (rootNode as any)._meta.name,
        },
      };

      return response;
    })
  );
}

export default fetchHierarchy;
