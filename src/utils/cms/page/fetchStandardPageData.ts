import fetchPageData, { FetchPageDataInput } from "./fetchPageData";
import { GetServerSidePropsContext } from "next";
import fetchContent, { CmsRequest } from "../fetchContent";
import { findInContentMap } from "../helpers/findInContentMap";
import { FetchMapInput } from "../helpers/fetchMap";
import { CmsHierarchyNode, CmsHierarchyRequest } from "../utils";
import { findInHierarchy } from "../helpers/findInHierarchy";
import { getLocalePrefix } from "@utils/helpers";

async function fetchStandardPageData<
  CT extends FetchMapInput<CmsRequest>,
  CH extends FetchMapInput<CmsHierarchyRequest>
>(input: FetchPageDataInput<CT, CH>, context: GetServerSidePropsContext) {

  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const data = await fetchPageData(
    {
      ...input,
      content: {
        ...input.content,
        // configComponents: { key: "config/components" }, //will change when structure of components in Amplience is final
      },
      hierarchies: {
        ...input.hierarchies,
        pages: [
          {
            tree: {
              key: `${localePrefix}headerNavigation`,
            },
          },
          {
            tree: {
              key: `${localePrefix}footerNavigation`,
            },
          }
        ],
      },
    },
    context
  );
  

  const url = (context.req.url as string).substring(0, ((context.req.url as string).indexOf('?') > (context.req.url as string).lastIndexOf('/') + 1) ? (context.req.url as string).indexOf('?')  : (context.req.url as string).length);

  const pageNode = findInHierarchy(
    (data.hierarchies as any).pages,
    (node: CmsHierarchyNode) => {
      const dk =
        context.req.url === "/" || context.req.url === "/en-ae" ? "homepage" : url;
      return node.content?._meta?.deliveryKey === dk;
    }
  );

  let page: any = {};

  if (
    pageNode &&
    pageNode.content._meta?.schema?.indexOf(
      "https://seddiqi.amplience.com/page/"
    ) === 0
  ) {
    const pageId = pageNode.content._meta.deliveryId;
    let fullPageContent = findInContentMap(
      data.content,
      (content) => content._meta.deliveryId === pageId
    );

    if (!fullPageContent) {
      [fullPageContent] = await fetchContent(
        [{ id: pageNode.content._meta.deliveryId }],
        data.context.cmsContext
      );
    }

    page = {
      page: fullPageContent,
      children: pageNode.children,
    };
  }

  return {
    ...data,
    page,
  };
}

export default fetchStandardPageData;
